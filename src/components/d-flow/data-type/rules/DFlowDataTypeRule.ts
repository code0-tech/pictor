import {DFlowDataTypeReactiveService} from "../DFlowDataType.service";
import type {Flow, GenericMapper, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowDataTypeRule {
    validate(value: NodeParameterValue, config: object, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeReactiveService, flow?: Flow): boolean
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