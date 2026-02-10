import type {Flow, GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {RuleMap} from "../d-flow-data-type/rules/DFlowDataTypeRules";
import {DataTypeView} from "../d-flow-data-type";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {VariantsMap} from "../d-flow-data-type/variants/DFlowDataTypeVariants";
import {DFlowFunctionReactiveService} from "../d-flow-function";

export const useValueValidation = (
    value: NodeParameterValue,
    dataType: DataTypeView,
    dataTypeService: DFlowDataTypeReactiveService,
    flow?: Flow,
    generics?: GenericMapper[],
    functionService?: DFlowFunctionReactiveService,
): boolean => {

    const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.target!!, generic]))

    const isRulesValid = dataType?.rules?.nodes?.every(rule => {
        if (!rule || !rule.variant || !rule.config) return false
        if (!RuleMap.get(rule.variant)) return true //TODO; missing parent type rule
        return RuleMap.get(rule.variant)?.validate(value, rule.config, map, flow, dataTypeService, functionService)
    }) ?? true

    const isVariantValid = VariantsMap.get(dataType.variant!!)?.validate(value) ?? true

    return isRulesValid && isVariantValid
}