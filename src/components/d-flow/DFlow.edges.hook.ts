import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "./DFlow.service";
import {Edge} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import React from "react";
import type {
    DataTypeIdentifier,
    Flow,
    Namespace,
    NamespaceProject,
    NodeFunction,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {md5} from "js-md5";
import {DFlowEdgeDataProps} from "./DFlowEdge";

export const FLOW_EDGE_RAINBOW: string[] = [
    'rgba(255, 255, 255, 0.25)',
];

// @ts-ignore
export const useFlowEdges = (flowId: Flow['id'], namespaceId?: Namespace['id'], projectId?: NamespaceProject['id']): Edge<DFlowEdgeDataProps>[] => {
    const flowService = useService(DFlowReactiveService);
    const flowStore = useStore(DFlowReactiveService)
    const functionService = useService(DFlowFunctionReactiveService);
    const functionStore = useStore(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const flow = React.useMemo(() => flowService.getById(flowId, {namespaceId, projectId}), [flowId, flowStore])

    return React.useMemo(() => {
        if (!flow) return [];

        // @ts-ignore
        const edges: Edge<DFlowEdgeDataProps>[] = [];

        const groupsWithValue = new Map<string, string[]>();

        let idCounter = 0;

        const functionCache = new Map<string, ReturnType<typeof functionService.getById>>();
        const dataTypeCache = new Map<DataTypeIdentifier, ReturnType<typeof dataTypeService.getDataType>>();

        const getFunctionDefinitionCached = (
            id: Scalars['FunctionDefinitionID']['output'],
            cache = functionCache,
        ) => {
            if (!cache.has(id)) {
                cache.set(id, functionService.getById(id));
            }
            return cache.get(id);
        };

        const getDataTypeCached = (
            type: DataTypeIdentifier,
            cache = dataTypeCache,
        ) => {
            if (!cache.has(type)) {
                cache.set(type, dataTypeService.getDataType(type));
            }
            return cache.get(type);
        };

        const traverse = (
            node: NodeFunction,
            parentNode?: NodeFunction,
            parentNodeId?: string,
            level = 0,
            fnCache = functionCache,
            dtCache = dataTypeCache,
        ): string => {

            const fnId = `${node.id}-${idCounter++}`;

            if (idCounter == 1) {
                edges.push({
                    id: `trigger-${fnId}-next`,
                    source: flow.id as string,
                    target: fnId,
                    data: {
                        color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                        type: 'default',
                        flowId: flowId,
                        parentNodeId: parentNode?.id
                    },
                    deletable: false,
                    selectable: false,
                });
            }

            if (parentNodeId) {
                const startGroups = groupsWithValue.get(parentNodeId) ?? [];

                if (startGroups.length > 0) {
                    startGroups.forEach((gId, idx) => edges.push({
                        id: `${gId}-${fnId}-next-${idx}`,
                        source: gId,
                        target: fnId,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            type: 'default',
                            flowId: flowId,
                            parentNodeId: parentNode?.id
                        },
                        deletable: false,
                        selectable: false,
                    }));
                } else {
                    edges.push({
                        id: `${parentNodeId}-${fnId}-next`,
                        source: parentNodeId,
                        target: fnId,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            type: 'default',
                            flowId: flowId,
                            parentNodeId: parentNode?.id
                        },
                        deletable: false,
                        selectable: false,
                    });
                }
            }

            node.parameters?.nodes?.forEach((param) => {
                const val = param?.value;
                const def = getFunctionDefinitionCached(node.functionDefinition?.id!!, fnCache)
                    ?.parameterDefinitions?.find(p => p.id === param?.id);
                const paramType = def?.dataTypeIdentifier;
                const paramDT = paramType ? getDataTypeCached(paramType, dtCache) : undefined;

                if (!val) return

                if (paramDT?.variant === "NODE") {
                    const groupId = `${fnId}-group-${idCounter++}`;
                    const hash = md5(`${fnId}-param-${JSON.stringify(param)}`)
                    const hashToHue = (md5: string): number => {
                        // nimm z.B. 8 Hex-Zeichen = 32 Bit
                        const int = parseInt(md5.slice(0, 8), 16)
                        return int % 360
                    }

                    edges.push({
                        id: `${fnId}-${groupId}-param-${param.id}`,
                        source: fnId,
                        target: groupId,
                        deletable: false,
                        selectable: false,
                        animated: true,
                        label: def?.names?.nodes!![0]?.content ?? param.id,
                        data: {
                            color: `hsl(${hashToHue(hash)}, 100%, 72%)`,
                            type: 'group',
                            flowId: flowId,
                            parentNodeId: parentNode?.id
                        },
                    });


                    if (val && val.__typename === "NodeFunctionIdWrapper") {

                        (groupsWithValue.get(fnId) ?? (groupsWithValue.set(fnId, []),
                            groupsWithValue.get(fnId)!))
                            .push(groupId);

                        traverse(
                            flowService.getNodeById(flowId, val.id)!,
                            node,
                            undefined,
                            level + 1,
                            fnCache,
                            dtCache
                        );
                    }
                } else if (val && val.__typename === "NodeFunctionIdWrapper") {
                    const subFnId = traverse(
                        flowService.getNodeById(flowId, val.id)!,
                        node,
                        undefined,
                        level + 1,
                        fnCache,
                        dtCache
                    );

                    const hash = md5(`${fnId}-param-${JSON.stringify(param)}`)
                    const hashToHue = (md5: string): number => {
                        // nimm z.B. 8 Hex-Zeichen = 32 Bit
                        const int = parseInt(md5.slice(0, 8), 16)
                        return int % 360
                    }

                    edges.push({
                        id: `${subFnId}-${fnId}-param-${param.id}`,
                        source: subFnId,
                        target: fnId,
                        targetHandle: `param-${param.id}`,
                        animated: true,
                        deletable: false,
                        selectable: false,
                        data: {
                            color: `hsl(${hashToHue(hash)}, 100%, 72%)`,
                            type: 'parameter',
                            flowId: flowId,
                            parentNodeId: parentNode?.id
                        },
                    });
                }
            });

            if (node.nextNodeId) {
                traverse(flowService.getNodeById(flow.id!!, node.nextNodeId!!)!!, node, fnId, level, fnCache, dtCache);   // gleiche Ebenentiefe
            }

            return fnId;
        };

        if (flow.startingNodeId) {
            traverse(flowService.getNodeById(flow.id!!, flow.startingNodeId!!)!!, undefined, undefined, 0, functionCache, dataTypeCache);
        }

        return edges
    }, [flow, flowStore, functionStore, dataTypeStore]);
};