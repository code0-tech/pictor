import {
    GenericCombinationStrategy,
    GenericMapper,
    GenericType,
    isRefObject,
    RefObject,
    Type,
    Value
} from "../DFlowDataType.view";
import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {isNodeFunctionObject, NodeFunctionObject} from "../../DFlow.view";

export interface DFlowDataTypeReturnTypeRuleConfig {
    type: Type // can be a key, a type or a generic type
}


@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeReturnTypeRule {
    public static validate(
        value: Value,
        config: DFlowDataTypeReturnTypeRuleConfig,
        generics?: Map<string, GenericMapper>,
        service?: DFlowDataTypeService
    ): boolean {

        const genericMapper = generics?.get(config.type as string)
        const genericTypes = generics?.get(config.type as string)?.types
        const genericCombination = generics?.get(config.type as string)?.generic_combination

        if (!(isNodeFunctionObject(value as NodeFunctionObject))) return false

        //TODO: only if its really a generic key
        if (typeof config.type === "string" && !genericMapper && !service?.getDataType(config.type)) return true

        if (!(service?.getDataType(config.type) || genericMapper)) return false

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
                    return !!service?.getDataType(genericType)?.validateDataType(service?.getDataType((foundReturnFunction.parameters!![0].value as RefObject).type)!!)
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
                return <boolean>service?.getDataType(config.type)?.validateValue(foundReturnFunction.parameters!![0].value!!)
            }

            return <boolean>service?.getDataType(config.type)?.validateValue(foundReturnFunction.parameters!![0].value!!, genericMapping(config.type.generic_mapper, generics))

        }

        return false

    }
}

const findReturnNode = (n: NodeFunctionObject): NodeFunctionObject | undefined => {
    if (n.function.runtime_function_id === 'RETURN') return n

    if (n.next_node) {
        const found = findReturnNode(n.next_node)
        if (found) return found
    }

    return undefined
}