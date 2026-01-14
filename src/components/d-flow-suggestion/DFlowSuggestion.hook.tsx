import {useService, useStore} from "../../utils";
import {DFlowSuggestion} from "./DFlowSuggestion.view";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";
import React from "react";
import type {
    Flow,
    NodeFunction,
    NodeParameter,
} from "@code0-tech/sagittarius-graphql-types";
import {useValueSuggestions} from "./DFlowValueSuggestions.hook";
import {useReferenceSuggestions} from "./DFlowReferenceSuggestions.hook";
import {useFunctionSuggestions} from "./DFlowFunctionSuggestions.hook";
import {useDataTypeSuggestions} from "./DFlowDataTypeSuggestions.hook";

//TODO: deep type search
//TODO: calculate FUNCTION_COMBINATION deepness max 2

export const useSuggestions = (
    flowId: Flow['id'],
    nodeId?: NodeFunction['id'],
    parameterId?: NodeParameter['id']
): DFlowSuggestion[] => {

    const functionService = useService(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    const node = React.useMemo(() => (flowService.getNodeById(flowId, nodeId)), [flowId, flowService, flowStore, nodeId])
    const functionDefinition = React.useMemo(() => (node?.functionDefinition?.id ? functionService.getById(node.functionDefinition.id) : undefined), [functionStore, functionService, node?.functionDefinition?.id])
    const parameterDefinition = React.useMemo(() => (functionDefinition?.parameterDefinitions?.find(definition => definition.id === parameterId)), [functionDefinition?.parameterDefinitions, parameterId])

    const dataTypeIdentifier = parameterDefinition?.dataTypeIdentifier!
    const genericKeys = functionDefinition?.genericKeys ?? []

    const valueSuggestions = useValueSuggestions(dataTypeIdentifier)
    const dataTypeSuggestions = useDataTypeSuggestions(dataTypeIdentifier)
    const refObjectSuggestions = useReferenceSuggestions(flowId, nodeId, dataTypeIdentifier, genericKeys)
    const functionSuggestions = useFunctionSuggestions(dataTypeIdentifier, genericKeys)

    return React.useMemo(() => {
        return [
            ...valueSuggestions,
            ...dataTypeSuggestions,
            ...refObjectSuggestions,
            ...functionSuggestions
        ].sort()
    }, [flowId, nodeId, parameterId, functionStore, flowStore])
}
