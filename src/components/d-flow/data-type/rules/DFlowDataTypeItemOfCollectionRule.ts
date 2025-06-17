import {Value} from "../DFlowDataType.view";
import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";

export interface DFlowDataTypeItemOfCollectionRuleConfig {
    items: Value[]
}

/**
 * @todo deep equality check for arrays and objects
 */
@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeItemOfCollectionRule {
    public static validate(value: Value, config: DFlowDataTypeItemOfCollectionRuleConfig): boolean {
        return config.items.includes(value)
    }
}