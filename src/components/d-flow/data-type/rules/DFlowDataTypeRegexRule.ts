import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DataTypeRulesRegexConfig, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeRegexRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesRegexConfig): boolean {
        if (value.__typename != 'LiteralValue') return false
        if (!config.pattern) return false
        return new RegExp(config.pattern).test(String(value.value))
    }
}