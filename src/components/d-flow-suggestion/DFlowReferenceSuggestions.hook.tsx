import React from "react";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {isMatchingType, replaceGenericsAndSortType, resolveType} from "../../utils/generics";
import type {
    DataTypeIdentifier,
    Flow,
    NodeFunction, NodeFunctionIdWrapper,
    NodeParameterValue,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";
import {useReturnType} from "../d-flow-function/DFlowFunction.return.hook";

export const useReferenceSuggestions = (
    flowId: Flow['id'],
    nodeId?: NodeFunction['id'],
    dataTypeIdentifier?: DataTypeIdentifier,
    genericKeys: string[] = []
): DFlowSuggestion[] => {
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const nodeContexts = useNodeContext(flowId)
    const nodeContext = React.useMemo(() => (
        nodeId ? nodeContexts?.find(context => context.nodeId === nodeId) : undefined
    ), [nodeContexts, nodeId])

    const resolvedType = React.useMemo(() => (
        dataTypeIdentifier ? replaceGenericsAndSortType(resolveType(dataTypeIdentifier, dataTypeService), genericKeys) : undefined
    ), [dataTypeIdentifier, dataTypeService, dataTypeStore, genericKeys])

    const refObjects = useRefObjects(flowId)

    return React.useMemo(() => {
        if (!resolvedType || !nodeContext) return []

        const {depth, scope, node} = nodeContext
        return refObjects.flatMap(value => {
            if (value.node === null || value.node === undefined) return []
            if (value.depth === null || value.depth === undefined) return []
            if (value.scope === null || value.scope === undefined) return []
            if (value.node >= node) return []
            if (value.depth > depth) return []
            if (value.scope.some(r => !scope.includes(r))) return []

            const resolvedRefObjectType = replaceGenericsAndSortType(resolveType(value.dataTypeIdentifier!!, dataTypeService), [])
            if (!isMatchingType(resolvedType, resolvedRefObjectType)) return []

            return [{
                path: [],
                type: DFlowSuggestionType.REF_OBJECT,
                displayText: [`${value.depth}-${value.scope}-${value.node || ''}`],
                value: value as ReferenceValue,
            }]
        })
    }, [dataTypeService, nodeContext, refObjects, resolvedType])
}


/**
 * Walks the flow starting at its startingNode (depth-first, left-to-right) and collects
 * all RefObjects (variables/outputs) with contextual metadata:
 *  - depth: nesting level (root 0; +1 per NODE-parameter sub-block)
 *  - scope: PATH of scope ids as number[], e.g. [0], [0,1], [0,2], [0,2,3] ...
 *           (root is [0]; each NODE-parameter group appends a new unique id)
 *  - node:  GLOBAL visit index across the entire flow (1-based, strictly increasing)
 *
 * Notes:
 *  - A NODE-typed parameter opens a new group/lane: depth+1 and scopePath+[newId].
 *  - Functions passed as non-NODE parameters are traversed in the SAME depth/scopePath.
 *  - The `node` id is incremented globally for every visited node and shared by all
 *    RefObjects (inputs from rules and the return value) produced by that node.
 */
const useRefObjects = (flowId: Flow['id']): Array<ReferenceValue> => {

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore]);
    const nodeContexts = useNodeContext(flowId)

    return flow?.nodes?.nodes?.map(node => {

        const nodeValues = node?.parameters?.nodes?.map(p => p?.value!!) ?? []
        const functionDefinition = functionService.getById(node?.functionDefinition?.id)
        const resolvedReturnType = useReturnType(functionDefinition!, nodeValues as NodeParameterValue[], dataTypeService)
        const nodeContext = nodeContexts?.find(context => context.nodeId === node?.id)

        if (resolvedReturnType) {
            return {
                __typename: "ReferenceValue",
                dataTypeIdentifier: resolvedReturnType,
                nodeFunctionId: node?.id,
                ...(nodeContext ?? {})
            } as ReferenceValue
        }

        return {} as ReferenceValue

    }) ?? []
}

export type NodeContext = {
    node: number
    depth: number
    scope: number[]
    nodeId: NodeFunction['id']
}

const useNodeContext = (
    flowId: Flow['id']
): NodeContext[] => {
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);

    const flowStore = useStore(DFlowReactiveService);
    const functionStore = useStore(DFlowFunctionReactiveService);
    const dataTypeStore = useStore(DFlowDataTypeReactiveService);

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore]);

    return React.useMemo(() => {
        if (!dataTypeService || !flowService || !functionService) return undefined;
        if (!flow?.startingNodeId) return undefined;

        let globalGroupId = 0;
        const nextGroupId = () => ++globalGroupId;

        let globalNodeId = 0;
        const nextNodeId = () => ++globalNodeId;

        const contexts: NodeContext[] = [];

        const traverse = (
            node: NodeFunctionIdWrapper | NodeFunction | undefined,
            depth: number,
            scopePath: number[]
        ) => {
            if (!node) return;

            let current: NodeFunction | undefined =
                node.__typename === "NodeFunctionIdWrapper"
                    ? flowService.getNodeById(flowId, node.id)
                    : (node as NodeFunction);

            while (current) {
                const def = functionService.getById(current.functionDefinition?.id!!);
                if (!def) break;

                const nodeIndex = nextNodeId();
                contexts.push({node: nodeIndex, depth, scope: scopePath, nodeId: current.id});

                if (current.parameters && def.parameterDefinitions) {
                    for (const pDef of def.parameterDefinitions) {
                        const pType = dataTypeService.getDataType(pDef.dataTypeIdentifier!!);
                        const paramInstance = current.parameters?.nodes?.find((p) => p?.id === pDef.id);

                        if (pType?.variant === "NODE") {
                            if (paramInstance?.value && paramInstance.value.__typename === "NodeFunctionIdWrapper") {
                                const childScopePath = [...scopePath, nextGroupId()];
                                traverse(paramInstance.value as NodeFunctionIdWrapper, depth + 1, childScopePath);
                            }
                        } else if (paramInstance?.value && paramInstance.value.__typename === "NodeFunctionIdWrapper") {
                            traverse(paramInstance.value as NodeFunctionIdWrapper, depth, scopePath);
                        }
                    }
                }

                current = flowService.getNodeById(flow.id, current.nextNodeId);
            }
        };

        traverse(flowService.getNodeById(flow.id, flow.startingNodeId), 0, [0]);

        return contexts
    }, [dataTypeService, flow, flowId, flowService, functionService, dataTypeStore, flowStore, functionStore]) ?? [];
};