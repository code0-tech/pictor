import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {DataTypeRulesItemOfCollectionConfig, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

/**
 * @todo deep equality check for arrays and objects
 */
@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeItemOfCollectionRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesItemOfCollectionConfig): boolean {
        if (!config.items) return false
        return "value" in value && config.items.includes(value.value)
    }
}