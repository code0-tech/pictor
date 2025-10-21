import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {
    DataTypeRulesReturnTypeConfig, GenericCombinationStrategyType,
    GenericMapper, GenericType, NodeFunction,
    NodeParameterValue,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";

//TODO: simple use useReturnType function
@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeReturnTypeRule {
    public static validate(
        value: NodeParameterValue,
        config: DataTypeRulesReturnTypeConfig,
        generics?: Map<string, GenericMapper>,
        service?: DFlowDataTypeService
    ): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sources
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        if (value.__typename != "NodeFunction") return false

        //TODO: only if its really a generic key
        if (config?.dataTypeIdentifier?.genericKey && !genericMapper && !service?.getDataType(config.dataTypeIdentifier)) return true

        if (!(service?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatypes does not exist
        if (genericMapper && !service?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        const foundReturnFunction = findReturnNode(value)
        if (!foundReturnFunction) return false

        if (foundReturnFunction?.parameters?.nodes!![0]?.value!!.__typename === "ReferenceValue") {

            //use generic given type for checking against value
            if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return !!service?.getDataType(genericType)?.validateDataType(service?.getDataType((foundReturnFunction?.parameters?.nodes!![0]?.value!! as ReferenceValue).dataTypeIdentifier!!)!!)
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1].type == GenericCombinationStrategyType.Or) {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (config?.dataTypeIdentifier?.dataType) {
                return !!service?.getDataType(config.dataTypeIdentifier!!)?.validateDataType(service?.getDataType(foundReturnFunction?.parameters?.nodes!![0]?.value?.dataTypeIdentifier!!)!!)
            }

        } else if (foundReturnFunction?.parameters?.nodes!![0]?.value?.__typename == "NodeFunction") {
            //TODO : allow function as return value
        } else {

            //use generic given type for checking against value
            if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return !!service?.getDataType(genericType)?.validateValue(foundReturnFunction?.parameters?.nodes!![0]?.value!!, ((genericType.genericType as GenericType)!!.genericMappers as GenericMapper[]))
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1].type == GenericCombinationStrategyType.Or) {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (config?.dataTypeIdentifier?.dataType) {
                return <boolean>service?.getDataType(config.dataTypeIdentifier!!)?.validateValue(foundReturnFunction?.parameters?.nodes!![0]?.value!!)
            }

            return <boolean>service?.getDataType(config.dataTypeIdentifier!!)?.validateValue(foundReturnFunction?.parameters?.nodes!![0]?.value!!, genericMapping(config.dataTypeIdentifier?.genericType?.genericMappers!!, generics))

        }

        return false

    }
}

const findReturnNode = (n: NodeFunction): NodeFunction | undefined => {
    if (n.runtimeFunction?.identifier === 'RETURN') return n

    if (n.ne) {
        const found = findReturnNode(n.next_node)
        if (found) return found
    }

    return undefined
}