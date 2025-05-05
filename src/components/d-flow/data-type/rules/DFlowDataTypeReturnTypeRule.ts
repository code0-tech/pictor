import {EDataType, isRefObject, Values} from "../DFlowDataType.view";
import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {isNodeFunctionObject, NodeFunctionObject} from "../../DFlow.view";

export interface DFlowDataTypeReturnTypeRuleConfig {
    type: string
}

@staticImplements<DFlowDataTypeRule>(EDataType.NODE)
export class DFlowDataTypeReturnTypeRule {
    public static validate(value: Values, config: DFlowDataTypeReturnTypeRuleConfig, service: DFlowDataTypeService): boolean {
        if (!(isNodeFunctionObject(value as NodeFunctionObject))) return false
        if (!service.getDataType(config.type)) return false

        const foundReturnFunction = findReturnNode(value as NodeFunctionObject)
        if (!foundReturnFunction) return false

        if (isRefObject(foundReturnFunction.parameters!![0].value!!)
            && service.getDataType(config.type)?.validateDataType(service.getDataType(foundReturnFunction.parameters!![0].value!!.type)!!))
            return true

        return <boolean>service.getDataType(config.type)?.validateValue(foundReturnFunction.parameters!![0].value!!)

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