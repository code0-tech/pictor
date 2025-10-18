import {DFlowDataTypeRegexRule} from "./DFlowDataTypeRegexRule";
import {DFlowDataTypeRangeRule} from "./DFlowDataTypeNumberRangeRule";
import {
    DFlowDataTypeItemOfCollectionRule
} from "./DFlowDataTypeItemOfCollectionRule";
import {DFlowDataTypeContainsTypeRule} from "./DFlowDataTypeContainsTypeRule";
import {DFlowDataTypeContainsKeyRule} from "./DFlowDataTypeContainsKeyRule";
import {DFlowDataTypeRule} from "./DFlowDataTypeRule";
import {DFlowDataTypeReturnTypeRule} from "./DFlowDataTypeReturnTypeRule";
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