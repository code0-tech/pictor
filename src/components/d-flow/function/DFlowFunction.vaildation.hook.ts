import {FunctionDefinition} from "./DFlowFunction.view";
import {DataType, GenericType, isRefObject, Value} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {InspectionSeverity, ValidationResult} from "../../../utils/inspection";
import {
    replaceGenericKeysInDataTypeObject,
    replaceGenericKeysInType,
    resolveGenericKeys
} from "../../../utils/generics";
import {isNodeFunctionObject, NodeFunctionObject} from "../DFlow.view";
import {useReturnType} from "./DFlowFunction.return.hook";
import {useService} from "../../../utils/contextStore";
import {DFlowFunctionReactiveService} from "./DFlowFunction.service";


/**
 * Validates function parameter values against a function definition, resolving all generics.
 * For each parameter, determines if the provided value is a valid match for the parameter's (possibly generic) type.
 * Returns an array of ValidationResults (errors for each parameter, null entry for valid).
 */
export const useFunctionValidation = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): ValidationResult[] | null => {
    const functionService = useService(DFlowFunctionReactiveService)
    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    const parameters = func.parameters ?? []
    const genericKeys = func.genericKeys ?? []
    const errors: ValidationResult[] = [];

    parameters.forEach((parameter, index) => {
        const value = values[index];
        const parameterType = parameter.type;
        const valueType = isNodeFunctionObject(value as NodeFunctionObject) ? useReturnType(functionService.getFunctionDefinition((value as NodeFunctionObject).function.function_id)!!, (value as NodeFunctionObject).parameters!!.map(p => p.value!!))!! : dataTypeService.getTypeFromValue(value);
        const parameterDataType = dataTypeService.getDataType(parameterType);
        const valueDataType = dataTypeService.getDataType(valueType);

        const paramLabel: string = `Parameter #${index + 1}`;

        // Check if the parameter is generic (by key or by structure)
        const isParameterGeneric =
            (typeof parameterType === "string" && genericKeys.includes(parameterType)) ||
            (typeof parameterType === "object" && parameterDataType);

        let isValid = true;

        if (isParameterGeneric) {
            if (typeof valueType === "object" && valueType && "type" in valueType && parameterDataType) {
                if (isRefObject(value) || isNodeFunctionObject(value as NodeFunctionObject)) {
                    const resolvedParameterDT = new DataType(
                        replaceGenericKeysInDataTypeObject(parameterDataType.json, genericTypeMap),
                        dataTypeService
                    );
                    const resolvedValueDT = new DataType(
                        replaceGenericKeysInDataTypeObject(valueDataType?.json!, genericTypeMap),
                        dataTypeService
                    );
                    isValid = resolvedParameterDT.validateDataType(resolvedValueDT);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Ref: Type mismatch"));
                    }
                } else {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap) as GenericType;
                    isValid = parameterDataType.validateValue(value, replacedGenericType.generic_mapper);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Value: Invalid value"));
                    }
                }
                return;
            }
            if (typeof parameterType === "string" && genericKeys.includes(parameterType)) {
                if (!isRefObject(value)) {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap) as GenericType;
                    isValid = !!dataTypeService.getDataType(replacedGenericType)?.validateValue(value, replacedGenericType.generic_mapper);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Key: Invalid value"));
                    }
                }
                return;
            }
            if (valueDataType && parameterDataType && parameterDataType.genericKeys && valueDataType.json && parameterDataType.json) {
                if (isRefObject(value) || isNodeFunctionObject(value as NodeFunctionObject)) {
                    const resolvedParameterDT = new DataType(
                        replaceGenericKeysInDataTypeObject(parameterDataType.json, genericTypeMap),
                        dataTypeService
                    );
                    isValid = resolvedParameterDT.validateDataType(valueDataType);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Param/Value: Type mismatch"));
                    }
                } else {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap) as GenericType;
                    isValid = !!dataTypeService.getDataType(replacedGenericType)?.validateValue(value, replacedGenericType.generic_mapper);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Generic Param/Value: Invalid value"));
                    }
                }
                return;
            }
        }

        // Non-generic parameter validation
        if (parameterDataType) {
            if (typeof valueType === "object" && valueType && "type" in valueType && parameterDataType) {
                if (isRefObject(value) || isNodeFunctionObject(value as NodeFunctionObject)) {
                    const resolvedValueDT = new DataType(
                        replaceGenericKeysInDataTypeObject(valueDataType?.json!, genericTypeMap),
                        dataTypeService
                    );
                    isValid = parameterDataType.validateDataType(resolvedValueDT);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Ref Type mismatch"));
                    }
                } else {
                    isValid = parameterDataType.validateValue(value);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Invalid value"));
                    }
                }
                return;
            }
            if (valueDataType) {
                if (isRefObject(value) || isNodeFunctionObject(value as NodeFunctionObject)) {
                    isValid = parameterDataType.validateDataType(valueDataType);
                    if (!isValid) {
                        errors.push(errorResult(paramLabel, parameterType, value, "Non-generic: Ref Type mismatch"));
                    }
                } else {
                    isValid = parameterDataType.validateValue(value);
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