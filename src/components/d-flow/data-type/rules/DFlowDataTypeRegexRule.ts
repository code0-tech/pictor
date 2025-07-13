import {Value} from "../DFlowDataType.view";
import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";

export interface DFlowDataTypeRegexRuleConfig {
    pattern: string
}

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeRegexRule {
    public static validate(value: Value, config: DFlowDataTypeRegexRuleConfig): boolean {
        if (!(typeof value === "string" || typeof value === "number" || typeof value === "boolean")) return false
        return new RegExp(config.pattern).test(String(value))
    }
}