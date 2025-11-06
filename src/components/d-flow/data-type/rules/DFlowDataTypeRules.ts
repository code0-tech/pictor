import {DFlowDataTypeRegexRule} from "./DFlowDataTypeRegexRule";
import {DFlowDataTypeRangeRule} from "./DFlowDataTypeNumberRangeRule";
import {
    DFlowDataTypeItemOfCollectionRule
} from "./DFlowDataTypeItemOfCollectionRule";
import {DFlowDataTypeContainsTypeRule} from "./DFlowDataTypeContainsTypeRule";
import {DFlowDataTypeContainsKeyRule} from "./DFlowDataTypeContainsKeyRule";
import {DFlowDataTypeRule} from "./DFlowDataTypeRule";
import {DFlowDataTypeReturnTypeRule} from "./DFlowDataTypeReturnTypeRule";
import type {DataTypeRulesVariant} from "@code0-tech/sagittarius-graphql-types";

export const RuleMap = new Map<DataTypeRulesVariant, DFlowDataTypeRule>([
    ["REGEX" as DataTypeRulesVariant.Regex, DFlowDataTypeRegexRule],
    ["NUMBER_RANGE" as DataTypeRulesVariant.NumberRange, DFlowDataTypeRangeRule],
    ["ITEM_OF_COLLECTION" as DataTypeRulesVariant.ItemOfCollection, DFlowDataTypeItemOfCollectionRule],
    ["CONTAINS_TYPE" as DataTypeRulesVariant.ContainsType, DFlowDataTypeContainsTypeRule],
    ["CONTAINS_KEY" as DataTypeRulesVariant.ContainsKey, DFlowDataTypeContainsKeyRule],
    ["RETURN_TYPE" as DataTypeRulesVariant.ReturnType, DFlowDataTypeReturnTypeRule]

])