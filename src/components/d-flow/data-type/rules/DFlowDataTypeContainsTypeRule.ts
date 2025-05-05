import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, Values} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsTypeRuleConfig {
    type: string
}

@staticImplements<DFlowDataTypeRule>(EDataType.ARRAY)
export class DFlowDataTypeContainsTypeRule {
    public static validate(value: Values, config: DFlowDataTypeContainsTypeRuleConfig, service: DFlowDataTypeService): boolean {
        if (!(Array.isArray(value))) return false
        if (!service.getDataType(config.type)) return false
        return value.every(value1 => service.getDataType(config.type)?.validateValue(value1))
    }
}