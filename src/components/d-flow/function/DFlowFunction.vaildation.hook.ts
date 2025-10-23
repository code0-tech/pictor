import {FunctionDefinitionView} from "./DFlowFunction.view";
import {DataTypeView} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {InspectionSeverity, ValidationResult} from "../../../utils/inspection";
import {
    replaceGenericKeysInDataTypeObject,
    replaceGenericKeysInType,
    resolveGenericKeys
} from "../../../utils/generics";
import {useReturnType} from "./DFlowFunction.return.hook";
import {useService} from "../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "./DFlowFunction.service";
import {DataTypeVariant, NodeFunction, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {useValidateDataType} from "../data-type/DFlowDataType.validation.type";
import {useValidateValue} from "../data-type/DFlowDataType.validation.value";


/**
 * Validates function parameter values against a function definition, resolving all generics.
 * For each parameter, determines if the provided value is a valid match for the parameter's (possibly generic) type.
 * Returns an array of ValidationResults (errors for each parameter, null entry for valid).
 */
export const useFunctionValidation = (
    func: FunctionDefinitionView,
    values: NodeParameterValue[],
    dataTypeService: DFlowDataTypeService
): ValidationResult[] | null => {
    const functionService = useService(DFlowFunctionReactiveService)
    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    const parameters = func.parameterDefinitions ?? []
    const genericKeys = func.genericKeys ?? []
    const errors: ValidationResult[] = [];

    parameters.forEach((parameter, index) => {
        const value = values[index]
        const parameterType = parameter.dataTypeIdentifier
        const valueType = value.__typename === "NodeFunction" ? useReturnType(functionService.getFunctionDefinition((value as NodeFunction).functionDefinition?.id!!)!!, (value as NodeFunction).parameters?.nodes?.map(p => p?.value!!)!!) : dataTypeService.getTypeFromValue(value);
        const parameterDataType = dataTypeService.getDataType(parameterType!!)
        const valueDataType = dataTypeService.getDataType(valueType!!)

        const paramLabel: string = `Parameter #${index + 1}`

        // Check if the parameter is generic (by key or by structure)
        const isParameterGeneric = (parameterDataType && parameterType?.genericType) || (parameterType?.genericKey && genericKeys.includes(parameterType.genericKey))

        let isValid = true

        if (isParameterGeneric) {
            if (valueType?.genericType && parameterDataType) {
                if (value.__typename === "ReferenceValue" || value.__typename === "NodeFunction") {
                    const resolvedParameterDT = new DataTypeView(
                        replaceGenericKeysInDataTypeObject(parameterDataType.json!!, genericTypeMap),
                        dataTypeService
                    );
                    const resolvedValueDT = new DataTypeView(
                        replaceGenericKeysInDataTypeObject(valueDataType?.json!, genericTypeMap),
                        dataTypeService
                    );
                    isValid = useValidateDataType(resolvedParameterDT, resolvedValueDT)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Ref: Type mismatch"));
                    }
                } else {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap)
                    isValid = useValidateValue(value, parameterDataType, replacedGenericType?.genericType?.genericMappers!!)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Value: Invalid value"));
                    }
                }
                return;
            }
            if (parameterType?.genericKey && genericKeys.includes(parameterType?.genericKey)) {
                if (value.__typename != "ReferenceValue") {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap)
                    isValid = useValidateValue(value, dataTypeService.getDataType(replacedGenericType)!!, replacedGenericType.genericType?.genericMappers!!)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Key: Invalid value"));
                    }
                }
                return;
            }
            if (valueDataType && parameterDataType && parameterDataType.genericKeys && valueDataType.json && parameterDataType.json) {
                if (value.__typename === "ReferenceValue" || value.__typename === "NodeFunction") {
                    const resolvedParameterDT = new DataTypeView(
                        replaceGenericKeysInDataTypeObject(parameterDataType.json, genericTypeMap),
                        dataTypeService
                    );
                    isValid = useValidateDataType(resolvedParameterDT, valueDataType)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Param/Value: Type mismatch"));
                    }
                } else {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap);
                    isValid = useValidateValue(value, dataTypeService.getDataType(replacedGenericType)!!, replacedGenericType.genericType?.genericMappers!!)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Param/Value: Invalid value"));
                    }
                }
                return;
            }
        }

        // Non-generic parameter validation
        if (parameterDataType) {
            if (valueType?.genericType && parameterDataType) {
                if (value.__typename === "ReferenceValue" || value.__typename === "NodeFunction") {
                    const resolvedValueDT = new DataTypeView(
                        replaceGenericKeysInDataTypeObject(valueDataType?.json!, genericTypeMap),
                        dataTypeService
                    );
                    isValid = useValidateDataType(parameterDataType, resolvedValueDT)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Ref Type mismatch"));
                    }
                } else {
                    isValid = useValidateValue(value, parameterDataType)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Invalid value"));
                    }
                }
                return;
            }

            if (valueDataType) {
                if ((value.__typename === "ReferenceValue" || value.__typename === "NodeFunction") && parameterDataType.variant !== DataTypeVariant.Node) {
                    isValid = useValidateDataType(parameterDataType, valueDataType)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Ref Type mismatch"));
                    }
                } else {
                    isValid = useValidateValue(value, parameterDataType)
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Invalid value"));
                    }
                }
                return;
            }
        }
        // If nothing matches, treat as invalid
        errors.push(errorResult(paramLabel, parameterType, value, "Unknown parameter/value combination"));
    });

    return errors.length > 0 ? errors : null;
};

const errorResult = (
    paramLabel: string,
    expectedType: any,
    actualValue: any,
    reason?: string
): ValidationResult => ({
    type: InspectionSeverity.ERROR,
    message: [{
        code: "de_DE",
        text:
            `${paramLabel}: Ungültiger Wert. Erwartet: ${typeToString(expectedType)}, ` +
            `Erhalten: ${valueToString(actualValue)}. ` +
            (reason ? `[${reason}]` : "")
    }]
})

function typeToString(t: any): string {
    if (typeof t === "object") return JSON.stringify(t);
    return String(t);
}

function valueToString(v: any): string {
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
}