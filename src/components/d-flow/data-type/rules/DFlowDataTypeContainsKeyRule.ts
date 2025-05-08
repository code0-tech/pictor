import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, isObject, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsKeyRuleConfig {
    key: string
    type: Type
}


@staticImplements<DFlowDataTypeRule>(EDataType.OBJECT)
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: Value, config: DFlowDataTypeContainsKeyRuleConfig, service: DFlowDataTypeService): boolean {
        if (!(isObject(value))) return false
        if (!service.getDataType(config.type)) return false
        return (config.key in value) && (!!service.getDataType(config.type)?.validateValue(value))
    }
}