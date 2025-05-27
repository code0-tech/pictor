import {EDataType, GenericMapper, GenericType, isRefObject, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {isNodeFunctionObject, NodeFunctionObject} from "../../DFlow.view";

export interface DFlowDataTypeReturnTypeRuleConfig {
    type: Type // can be a key, a type or a generic type
}


@staticImplements<DFlowDataTypeRule>(EDataType.NODE)
export class DFlowDataTypeReturnTypeRule {
    public static validate(
        value: Value,
        config: DFlowDataTypeReturnTypeRuleConfig,
        generics?: Map<string, Type>,
        service?: DFlowDataTypeService
    ): boolean {
        if (!(isNodeFunctionObject(value as NodeFunctionObject))) return false
        if (!(service?.getDataType(config.type) || generics?.get(config.type as string))) return false

        //use of generic key but datatype does not exist
        if (generics?.get(config.type as string) && !service?.getDataType(generics?.get(config.type as string)!!)) return false

        const foundReturnFunction = findReturnNode(value as NodeFunctionObject)
        if (!foundReturnFunction) return false

        if (isRefObject(foundReturnFunction.parameters!![0].value!!)) {

            //use generic given type for checking against value
            if (generics?.get(config.type as string)) {
                return !!service?.getDataType(generics?.get(config.type as string)!!)?.validateDataType(service?.getDataType(foundReturnFunction.parameters!![0].value!!.type)!!)
            }

            if (typeof config.type === "string") {
                return !!service?.getDataType(config.type)?.validateDataType(service?.getDataType(foundReturnFunction.parameters!![0].value!!.type)!!)
            }

        } else {

            //use generic given type for checking against value
            if (generics?.get(config.type as string)) {
                return <boolean>service?.getDataType(generics?.get(config.type as string)!!)?.validateValue(foundReturnFunction.parameters!![0].value!!, ((generics?.get(config.type as string) as GenericType)!!.generic_mapper as GenericMapper[]))
            }

            if (typeof config.type === "string") {
                return <boolean>service?.getDataType(config.type)?.validateValue(foundReturnFunction.parameters!![0].value!!)
            }

            //mapping generics to generic type
            const genericsMapper: GenericMapper[] | undefined = config.type.generic_mapper?.map(generic => {
                return {
                    generic_target: generic.generic_target,
                    type: generics?.get(generic.generic_target)!!
                }
            })

            return <boolean>service?.getDataType(config.type)?.validateValue(foundReturnFunction.parameters!![0].value!!, genericsMapper)

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