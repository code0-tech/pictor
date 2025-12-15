import type {Flow, GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {RuleMap} from "./rules/DFlowDataTypeRules";
import {DataTypeView} from "./DFlowDataType.view";
import {DFlowDataTypeReactiveService} from "./DFlowDataType.service";

export const useValidateValue = (
    value: NodeParameterValue,
    dataType: DataTypeView,
    dataTypeService: DFlowDataTypeReactiveService,
    flow?: Flow,
    generics?: GenericMapper[],
): boolean => {

    const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.target!!, generic]))

    return dataType.rules?.nodes?.every(rule => {
        if (!rule || !rule.variant || !rule.config) return false
        if (!RuleMap.get(rule.variant)) return true
        return RuleMap.get(rule.variant)?.validate(value, rule.config, map, dataTypeService, flow)
    }) ?? true
}