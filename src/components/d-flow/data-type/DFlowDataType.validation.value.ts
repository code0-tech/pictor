import {GenericMapper, NodeParameterValue, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {RuleMap} from "./rules/DFlowDataTypeRules";
import {DataTypeView} from "./DFlowDataType.view";
import {useService} from "../../../utils/contextStore";
import {DFlowDataTypeReactiveService} from "./DFlowDataType.service";
import {DFlowReactiveService} from "../DFlow.service";
import {FlowView} from "../DFlow.view";

export const useValidateValue = (
    value: NodeParameterValue,
    dataType: DataTypeView,
    flow?: FlowView,
    generics?: GenericMapper[],
): boolean => {

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const flowService = useService(DFlowReactiveService)

    const map = new Map<string, GenericMapper>(generics?.map(generic => [generic.target!!, generic]))

    return dataType.rules?.nodes?.every(rule => {
        if (!rule || !rule.variant || !rule.config) return false
        return RuleMap.get(rule.variant)?.validate(value, rule.config, map, dataTypeService, flow)
    }) ?? false
}