import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, isObject, Values} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsKeyRuleConfig {
    key: string
    type: string
}


@staticImplements<DFlowDataTypeRule>(EDataType.OBJECT)
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: Values, config: DFlowDataTypeContainsKeyRuleConfig, service: DFlowDataTypeService): boolean {
        if (!(isObject(value))) return false
        if (!service.getDataType(config.type)) return false
        return (config.key in value) && (!!service.getDataType(config.type)?.validateValue(value))
    }
}