import {FunctionDefinition} from "./DFlowFunction.view";
import {DataType, GenericMapper, GenericType, isRefObject, Type, Value} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {InspectionSeverity, ValidationResult} from "../../../utils/inspection";
import {
    replaceGenericKeysInDataTypeObject,
    replaceGenericKeysInType,
    resolveAllGenericKeysInDataTypeObject,
    resolveGenericKeyMappings
} from "../../../utils/generics";

export const useFunctionValidation = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): ValidationResult[] | null => {

    const genericMap = new Map<string, Type | GenericMapper>()

    const parameterValidation = func.parameters?.every((parameter, index) => {

        const typeFromValue = dataTypeService.getTypeFromValue(values[index])
        const dataTypeFromValue = dataTypeService.getDataType(typeFromValue)
        const typeFromParameter = parameter.type
        const dataTypeFromParameter = dataTypeService.getDataType(typeFromParameter)

        //check if parameter is generic or non-generic
        if (func.genericKeys?.includes(String(parameter.type))
            || (typeof parameter.type == "object"
                && "type" in (parameter.type as GenericType)
                && dataTypeService.getDataType(parameter.type))) {

            //check linked value if generic or non-generic
            //if: parameter and value is generic
            //else if: parameter is generic but value not
            if (typeof typeFromValue == "object"
                && "type" in (typeFromValue as GenericType)
                && dataTypeService.getDataType(parameter.type)) {

                const genericTypes = resolveGenericKeyMappings(typeFromParameter, typeFromValue, func.genericKeys!!)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                if (isRefObject(values[index])) {
                    const tempDataTypeFromParameter = new DataType(replaceGenericKeysInDataTypeObject(dataTypeFromParameter?.json!!, genericMap), dataTypeService)
                    const tempDataTypeFromValue = new DataType(replaceGenericKeysInDataTypeObject(dataTypeFromValue?.json!!, genericMap), dataTypeService)
                    return tempDataTypeFromParameter?.validateDataType(tempDataTypeFromValue)
                } else {
                    const replacedGenericMapper = replaceGenericKeysInType(parameter.type, genericMap) as GenericType
                    return dataTypeService.getDataType(parameter.type)?.validateValue(values[index], replacedGenericMapper.generic_mapper)
                }

            } else if (func.genericKeys?.includes(String(parameter.type))) {

                const genericTypes = resolveGenericKeyMappings(typeFromParameter, typeFromValue, func.genericKeys!!)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                if (isRefObject(values[index])) {
                    return true
                } else {
                    const replacedGenericMapper = replaceGenericKeysInType(parameter.type, genericMap) as GenericType
                    return dataTypeService.getDataType(replacedGenericMapper)?.validateValue(values[index], replacedGenericMapper.generic_mapper)
                }
            } else if (dataTypeService.getDataType(typeFromValue) && dataTypeFromParameter && dataTypeFromValue && dataTypeFromParameter.genericKeys) {

                //parameter is generic but value not
                const genericTypes = resolveAllGenericKeysInDataTypeObject(dataTypeFromParameter.json, dataTypeFromValue.json, dataTypeFromParameter.genericKeys)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    if (genericTypes[genericKey])
                        genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                if (isRefObject(values[index])) {
                    const tempDataTypeFromParameter = new DataType(replaceGenericKeysInDataTypeObject(dataTypeFromParameter?.json!!, genericMap), dataTypeService)
                    return tempDataTypeFromParameter?.validateDataType(dataTypeFromValue)
                } else {
                    const replacedGenericMapper = replaceGenericKeysInType(parameter.type, genericMap) as GenericType
                    return dataTypeService.getDataType(replacedGenericMapper)?.validateValue(values[index], replacedGenericMapper.generic_mapper)
                }

            }
        } else if (dataTypeService.getDataType(parameter.type)) {

            //check linked value if generic or non-generic
            if (typeof typeFromValue == "object"
                && "type" in (typeFromValue as GenericType)
                && dataTypeService.getDataType(parameter.type)) {

                const genericTypes = resolveGenericKeyMappings(typeFromParameter, typeFromValue, func.genericKeys!!)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                if (isRefObject(values[index])) {
                    const tempDataTypeFromValue = new DataType(replaceGenericKeysInDataTypeObject(dataTypeFromValue?.json!!, genericMap), dataTypeService)
                    return dataTypeFromParameter?.validateDataType(tempDataTypeFromValue)
                }

                return dataTypeFromParameter?.validateValue(values[index])
            } else if (dataTypeService.getDataType(typeFromValue)) {

                if (isRefObject(values[index]) && dataTypeFromValue) {
                    return dataTypeFromParameter?.validateDataType(dataTypeFromValue)
                }

                return dataTypeFromParameter?.validateValue(values[index])
            }
        }
        return false
    })

    return parameterValidation ? null : [{
        type: InspectionSeverity.ERROR,
        message: [{
            code: "de_DE",
            text: "Not working"
        }]
    }]

}