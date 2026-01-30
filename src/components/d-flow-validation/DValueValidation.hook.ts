import type {Flow, GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {RuleMap} from "../d-flow-data-type/rules/DFlowDataTypeRules";
import {DataTypeView} from "../d-flow-data-type";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {VariantsMap} from "../d-flow-data-type/variants/DFlowDataTypeVariants";

export const useValueValidation = (
    value: NodeParameterValue,
    dataType: DataTypeView,
    dataTypeService: DFlowDataTypeReactiveService,
    flow?: Flow,
    generics?: GenericMapper[],
): boolean => {

    const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.target!!, generic]))

    const isRulesValid = dataType.rules?.nodes?.every(rule => {
        if (!rule || !rule.variant || !rule.config) return false
        if (!RuleMap.get(rule.variant)) return true //TODO; missing parent type rule
        return RuleMap.get(rule.variant)?.validate(value, rule.config, map, dataTypeService, flow)
    }) ?? true

    const isVariantValid = VariantsMap.get(dataType.variant!!)?.validate(value) ?? true

    return isRulesValid && isVariantValid
}