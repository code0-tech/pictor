import {EDataType, Values} from "../DFlowDataType.view";
import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";

export interface DFlowDataTypeRegexRuleConfig {
    pattern: string
}

@staticImplements<DFlowDataTypeRule>(EDataType.PRIMITIVE, EDataType.TYPE)
export class DFlowDataTypeRegexRule {
    public static validate(value: Values, config: DFlowDataTypeRegexRuleConfig): boolean {
        if (!(typeof value === "string" || typeof value === "number" || typeof value === "boolean")) return false
        return new RegExp(config.pattern).test(String(value))
    }
}