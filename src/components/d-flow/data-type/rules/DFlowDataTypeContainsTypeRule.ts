import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsTypeRuleConfig {
    type: Type
}

@staticImplements<DFlowDataTypeRule>(EDataType.ARRAY)
export class DFlowDataTypeContainsTypeRule {
    public static validate(value: Value, config: DFlowDataTypeContainsTypeRuleConfig, service: DFlowDataTypeService): boolean {
        if (!(Array.isArray(value))) return false
        if (!service.getDataType(config.type)) return false
        return value.every(value1 => service.getDataType(config.type)?.validateValue(value1))
    }
}