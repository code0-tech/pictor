import {EDataType, EDataTypeRuleType, Values} from "../DFlowDataType.view";
import {DFlowDataTypeRegexRule, DFlowDataTypeRegexRuleConfig} from "./DFlowDataTypeRegexRule";
import {DFlowDataTypeNumberRangeRuleConfig, DFlowDataTypeRangeRule} from "./DFlowDataTypeNumberRangeRule";
import {
    DFlowDataTypeItemOfCollectionRule,
    DFlowDataTypeItemOfCollectionRuleConfig
} from "./DFlowDataTypeItemOfCollectionRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {DFlowDataTypeContainsTypeRule, DFlowDataTypeContainsTypeRuleConfig} from "./DFlowDataTypeContainsTypeRule";
import {DFlowDataTypeContainsKeyRule, DFlowDataTypeContainsKeyRuleConfig} from "./DFlowDataTypeContainsKeyRule";

export interface DFlowDataTypeRule {
    validate(value: Values, config: object, service: DFlowDataTypeService): boolean
}

export const staticImplements = <T>(...types: EDataType[]) => {
    return <U extends T>(constructor: U) => constructor
}

export const RuleMap = new Map<EDataTypeRuleType, DFlowDataTypeRule>([
    [EDataTypeRuleType.REGEX, DFlowDataTypeRegexRule],
    [EDataTypeRuleType.NUMBER_RANGE, DFlowDataTypeRangeRule],
    [EDataTypeRuleType.ITEM_OF_COLLECTION, DFlowDataTypeItemOfCollectionRule],
    [EDataTypeRuleType.CONTAINS_TYPE, DFlowDataTypeContainsTypeRule],
    [EDataTypeRuleType.CONTAINS_KEY, DFlowDataTypeContainsKeyRule]

])

export type CombinesRuleConfig = DFlowDataTypeRegexRuleConfig
    | DFlowDataTypeNumberRangeRuleConfig
    | DFlowDataTypeItemOfCollectionRuleConfig
    | DFlowDataTypeContainsTypeRuleConfig
    | DFlowDataTypeContainsKeyRuleConfig
