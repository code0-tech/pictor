import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import type {DataTypeRulesNumberRangeConfig, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeRangeRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesNumberRangeConfig): boolean {
        if (value.__typename !== 'LiteralValue') return false
        if (!config.from || !config.to) return false
        return value.value >= config.from && value.value <= config.to
    }
}