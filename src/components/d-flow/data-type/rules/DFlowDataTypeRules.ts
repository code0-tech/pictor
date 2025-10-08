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
import {DataTypeRulesVariant} from "@code0-tech/sagittarius-graphql-types";

export enum EDataTypeRuleType {
    REGEX,
    NUMBER_RANGE,
    ITEM_OF_COLLECTION,
    CONTAINS_TYPE,
    CONTAINS_KEY,
    LOCK_KEY,
    RETURNS_TYPE,
    INPUT_TYPE,
    PARENT
    //etc
}

export const RuleMap = new Map<DataTypeRulesVariant, DFlowDataTypeRule>([
    [DataTypeRulesVariant.Regex, DFlowDataTypeRegexRule],
    [DataTypeRulesVariant.NumberRange, DFlowDataTypeRangeRule],
    [DataTypeRulesVariant.ItemOfCollection, DFlowDataTypeItemOfCollectionRule],
    [DataTypeRulesVariant.ContainsType, DFlowDataTypeContainsTypeRule],
    [DataTypeRulesVariant.ContainsKey, DFlowDataTypeContainsKeyRule],
    [DataTypeRulesVariant.ReturnType, DFlowDataTypeReturnTypeRule]

])

//TODO: add input type rule
export type CombinesRuleConfig = DFlowDataTypeRegexRuleConfig
    | DFlowDataTypeNumberRangeRuleConfig
    | DFlowDataTypeItemOfCollectionRuleConfig
    | DFlowDataTypeContainsTypeRuleConfig
    | DFlowDataTypeContainsKeyRuleConfig
    | DFlowDataTypeReturnTypeRuleConfig
    | DFlowDataTypeParentRuleConfig
