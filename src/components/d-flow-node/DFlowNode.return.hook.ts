import {replaceGenericKeysInType, resolveGenericKeys} from "../../utils/generics";
import type {DataTypeIdentifier, Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowReactiveService} from "../d-flow";
import React from "react";

export const useReturnTypes = (
    flowId: Flow['id']
): Map<NodeFunction['id'], DataTypeIdentifier | null> => {

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)

    return React.useMemo(() => {
        const flow = flowService.getById(flowId)
        return getReturnTypesForFlow(flow!, functionService, dataTypeService)
    }, [flowId, flowStore, functionStore, dataTypeService])

}

export function getReturnTypesForFlow(
    flow: Flow,
    functionService: DFlowFunctionReactiveService,
    dataTypeService: DFlowDataTypeReactiveService
): Map<NodeFunction['id'], DataTypeIdentifier | null> {
    const nodes = flow?.nodes?.nodes;
    const result = new Map<NodeFunction['id'], DataTypeIdentifier | null>();
    nodes?.forEach(node => {
        const values = node?.parameters?.nodes?.map(p => p?.value!) ?? [];
        const func = functionService.getById(node?.functionDefinition?.id!!);
        const genericTypeMap = resolveGenericKeys(func!, values, dataTypeService, functionService);
        const returnType = func?.returnType ? replaceGenericKeysInType(func.returnType, genericTypeMap) : null;
        if (node?.id) {
            result.set(node.id, returnType);
        }
    });
    return result;
}