import {FunctionDefinition} from "./DFlowFunction.view";
import {DataType, GenericType, isRefObject, Value} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {InspectionSeverity, ValidationResult} from "../../../utils/inspection";
import {
    replaceGenericKeysInDataTypeObject,
    replaceGenericKeysInType,
    resolveGenericKeys
} from "../../../utils/generics";

/**
 * Validates function parameter values against a function definition, resolving all generics.
 *
 * For each parameter, determines if the provided value is a valid match for the parameter's (possibly generic) type.
 * All generics are resolved using the provided value array and the type service.
 *
 * Performance optimizations:
 * - Avoids repeated type and data type lookups
 * - Short-circuits validation as soon as an invalid value is found
 * - Handles all reference/value and generic/non-generic cases efficiently
 *
 * @param func              The function definition (including parameters and generics)
 * @param values            The values to validate against the parameters
 * @param dataTypeService   Service for resolving types and validating values
 * @returns                null if validation is successful, or a ValidationResult[] if not
 */
export const useFunctionValidation = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): ValidationResult[] | null => {
    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    const parameters = func.parameters ?? []
    const genericKeys = func.genericKeys ?? []

    for (let index = 0; index < parameters.length; index++) {
        const parameter = parameters[index]
        const value = values[index]
        const parameterType = parameter.type
        const valueType = dataTypeService.getTypeFromValue(value)
        const parameterDataType = dataTypeService.getDataType(parameterType)
        const valueDataType = dataTypeService.getDataType(valueType)

        // Check if the parameter is generic (by key or by structure)
        const isParameterGeneric =
            (typeof parameterType === "string" && genericKeys.includes(parameterType)) ||
            (typeof parameterType === "object" && parameterDataType)

        if (isParameterGeneric) {
            // Case: Both parameter and value are generic
            if (typeof valueType === "object" && valueType && "type" in valueType && parameterDataType) {
                if (isRefObject(value)) {
                    const resolvedParameterDT = new DataType(
                        replaceGenericKeysInDataTypeObject(parameterDataType.json, genericTypeMap),
                        dataTypeService
                    )
                    const resolvedValueDT = new DataType(
                        replaceGenericKeysInDataTypeObject(valueDataType?.json!, genericTypeMap),
                        dataTypeService
                    )
                    if (!resolvedParameterDT.validateDataType(resolvedValueDT)) return errorResult()
                } else {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap) as GenericType
                    if (!parameterDataType.validateValue(value, replacedGenericType.generic_mapper))
                        return errorResult()
                }
                continue
            }
            // Case: Parameter is generic key, value is concrete
            if (typeof parameterType === "string" && genericKeys.includes(parameterType)) {
                if (!isRefObject(value)) {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap) as GenericType
                    if (!dataTypeService.getDataType(replacedGenericType)?.validateValue(value, replacedGenericType.generic_mapper))
                        return errorResult()
                }
                continue
            }
            // Case: Parameter is generic, value is concrete type
            if (valueDataType && parameterDataType && parameterDataType.genericKeys && valueDataType.json && parameterDataType.json) {
                if (isRefObject(value)) {
                    const resolvedParameterDT = new DataType(
                        replaceGenericKeysInDataTypeObject(parameterDataType.json, genericTypeMap),
                        dataTypeService
                    )
                    if (!resolvedParameterDT.validateDataType(valueDataType)) return errorResult()
                } else {
                    const replacedGenericType = replaceGenericKeysInType(parameterType, genericTypeMap) as GenericType
                    if (!dataTypeService.getDataType(replacedGenericType)?.validateValue(value, replacedGenericType.generic_mapper))
                        return errorResult()
                }
                continue
            }
        }

        // Non-generic parameter validation
        if (parameterDataType) {
            // Case: Value is generic
            if (typeof valueType === "object" && valueType && "type" in valueType && parameterDataType) {
                if (isRefObject(value)) {
                    const resolvedValueDT = new DataType(
                        replaceGenericKeysInDataTypeObject(valueDataType?.json!, genericTypeMap),
                        dataTypeService
                    )
                    if (!parameterDataType.validateDataType(resolvedValueDT)) return errorResult()
                } else {
                    if (!parameterDataType.validateValue(value)) return errorResult()
                }
                continue
            }
            // Case: Both parameter and value are concrete
            if (valueDataType) {
                if (isRefObject(value)) {
                    if (!parameterDataType.validateDataType(valueDataType)) return errorResult()
                } else {
                    if (!parameterDataType.validateValue(value)) return errorResult()
                }
                continue
            }
        }
        // If nothing matches, treat as invalid
        return errorResult()
    }
    return null
}

const errorResult = (): ValidationResult[] => [{
    type: InspectionSeverity.ERROR,
    message: [{ code: "de_DE", text: "Not working" }]
}]
