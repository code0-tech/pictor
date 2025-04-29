import {EDataType, EDataTypeRuleType, RawDataTypes} from "../DFlowDataType.view";
import {DFlowDataTypeRegexRule} from "./DFlowDataTypeRegexRule";
import {DFlowDataTypeRangeRule} from "./DFlowDataTypeNumberRangeRule";
import {DFlowDataTypeItemOfCollectionRule} from "./DFlowDataTypeItemOfCollectionRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {DFlowDataTypeContainsTypeRule} from "./DFlowDataTypeContainsTypeRule";
import {DFlowDataTypeContainsKeyRule} from "./DFlowDataTypeContainsKeyRule";

export interface DFlowDataTypeRule {
    validate(value: RawDataTypes, config: object, service: DFlowDataTypeService): boolean
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
