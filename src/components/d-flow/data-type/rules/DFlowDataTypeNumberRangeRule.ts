import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, Value} from "../DFlowDataType.view";

export interface DFlowDataTypeNumberRangeRuleConfig {
    from: number
    to: number
    step?: number //TODO
}

@staticImplements<DFlowDataTypeRule>(EDataType.PRIMITIVE, EDataType.TYPE)
export class DFlowDataTypeRangeRule {
    public static validate(value: Value, config: DFlowDataTypeNumberRangeRuleConfig): boolean {
        if (!(typeof value === "number")) return false
        return value >= config.from && value <= config.to
    }
}