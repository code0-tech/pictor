import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, RawDataTypes} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsKeyRuleConfig {
    key: string
    type: string
}

/**
 * @todo check if value is of type RawObject
 */
@staticImplements<DFlowDataTypeRule>(EDataType.OBJECT)
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: RawDataTypes, config: DFlowDataTypeContainsKeyRuleConfig, service: DFlowDataTypeService): boolean {
        if (!(typeof value === "object")) return false
        if (!service.getDataType(config.type)) return false
        return (config.key in value) && (!!service.getDataType(config.type)?.validateValue(value))
    }
}