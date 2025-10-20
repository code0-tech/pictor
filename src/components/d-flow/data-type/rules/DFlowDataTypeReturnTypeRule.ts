import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {
    DataTypeRulesReturnTypeConfig,
    GenericMapper, NodeFunction,
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

        const foundReturnFunction = findReturnNode(value as NodeFunctionObject)
        if (!foundReturnFunction) return false

        if (isRefObject(foundReturnFunction.parameters!![0].value!!)) {

            //use generic given type for checking against value
            if (typeof config.type === "string" && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return !!service?.getDataType(genericType)?.validateDataType(service?.getDataType((foundReturnFunction.parameters!![0].value as ReferenceValue).dataTypeIdentifier)!!)
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1] == GenericCombinationStrategy.OR) {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (typeof config.type === "string") {
                return !!service?.getDataType(config.type)?.validateDataType(service?.getDataType(foundReturnFunction.parameters!![0].value!!.type)!!)
            }

        } else if (isNodeFunctionObject(foundReturnFunction.parameters!![0].value!! as NodeFunctionObject)) {
            //TODO : allow function as return value
        } else {

            //use generic given type for checking against value
            if (typeof config.type === "string" && genericMapper && genericTypes) {

                const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                    return !!service?.getDataType(genericType)?.validateValue(foundReturnFunction.parameters!![0].value!!, ((genericType as GenericType)!!.generic_mapper as GenericMapper[]))
                })

                return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                    if (genericCombination && genericCombination[currentIndex - 1] == GenericCombinationStrategy.OR) {
                        return previousValue || currentValue
                    }

                    return previousValue && currentValue
                }) : checkAllTypes[0]
            }

            if (typeof config.type === "string") {
                return <boolean>service?.getDataType(config.dataTypeIdentifier!!)?.validateValue(foundReturnFunction.parameters!![0].value!!)
            }

            return <boolean>service?.getDataType(config.type)?.validateValue(foundReturnFunction.parameters!![0].value!!, genericMapping(config.type.generic_mapper, generics))

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