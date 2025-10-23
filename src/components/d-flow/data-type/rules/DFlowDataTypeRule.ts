import {DFlowDataTypeService} from "../DFlowDataType.service";
import {GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {FlowView} from "../../DFlow.view";

export interface DFlowDataTypeRule {
    validate(value: NodeParameterValue, config: object, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService, flow?: FlowView): boolean
}

export const staticImplements = <T>() => {
    return <U extends T>(constructor: U) => constructor
}

export const genericMapping = (to?: GenericMapper[], from?: Map<string, GenericMapper>): GenericMapper[] | undefined => {

    if (!to || !from) return []

    return to.map(generic => ({
        ...generic,
        target: generic.target,
        sources: generic?.sourceDataTypeIdentifiers?.map(type => from?.get(type.genericKey!!)?.sourceDataTypeIdentifiers!!).flat(),
        genericCombinationStrategies: generic?.sourceDataTypeIdentifiers?.map(type => from?.get(type.genericKey!!)?.genericCombinationStrategies!!).flat()
    }))
}