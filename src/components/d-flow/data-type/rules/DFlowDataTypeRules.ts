import {EDataTypeRuleType} from "../DFlowDataType.view";
import {DFlowDataTypeRegexRule, DFlowDataTypeRegexRuleConfig} from "./DFlowDataTypeRegexRule";
import {DFlowDataTypeNumberRangeRuleConfig, DFlowDataTypeRangeRule} from "./DFlowDataTypeNumberRangeRule";
import {
    DFlowDataTypeItemOfCollectionRule,
    DFlowDataTypeItemOfCollectionRuleConfig
} from "./DFlowDataTypeItemOfCollectionRule";
import {DFlowDataTypeContainsTypeRule, DFlowDataTypeContainsTypeRuleConfig} from "./DFlowDataTypeContainsTypeRule";
import {DFlowDataTypeContainsKeyRule, DFlowDataTypeContainsKeyRuleConfig} from "./DFlowDataTypeContainsKeyRule";
import {DFlowDataTypeRule} from "./DFlowDataTypeRule";
import {DFlowDataTypeReturnTypeRule, DFlowDataTypeReturnTypeRuleConfig} from "./DFlowDataTypeReturnTypeRule";
import {DFlowDataTypeParentRule, DFlowDataTypeParentRuleConfig} from "./DFlowDataTypeParentRule";

export const RuleMap = new Map<EDataTypeRuleType, DFlowDataTypeRule>([
    [EDataTypeRuleType.REGEX, DFlowDataTypeRegexRule],
    [EDataTypeRuleType.NUMBER_RANGE, DFlowDataTypeRangeRule],
    [EDataTypeRuleType.ITEM_OF_COLLECTION, DFlowDataTypeItemOfCollectionRule],
    [EDataTypeRuleType.CONTAINS_TYPE, DFlowDataTypeContainsTypeRule],
    [EDataTypeRuleType.CONTAINS_KEY, DFlowDataTypeContainsKeyRule],
    [EDataTypeRuleType.RETURNS_TYPE, DFlowDataTypeReturnTypeRule],
    [EDataTypeRuleType.PARENT, DFlowDataTypeParentRule]

])

//TODO: add input type rule
export type CombinesRuleConfig = DFlowDataTypeRegexRuleConfig
    | DFlowDataTypeNumberRangeRuleConfig
    | DFlowDataTypeItemOfCollectionRuleConfig
    | DFlowDataTypeContainsTypeRuleConfig
    | DFlowDataTypeContainsKeyRuleConfig
    | DFlowDataTypeReturnTypeRuleConfig
    | DFlowDataTypeParentRuleConfig
