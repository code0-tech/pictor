import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "./DFlow.service";
import {Edge} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import React from "react";
import type {Flow, Namespace, NamespaceProject, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import {DFlowEdgeDataProps} from "./DFlowEdge";
import {hashToColor} from "./DFlow.util";

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

        const traverse = (
            node: NodeFunction,
            parentNode?: NodeFunction,
            isParameter = false
        ): string => {
            if (!node) return ""

            if (node.id == flow.startingNodeId) {
                edges.push({
                    id: `trigger-${node.id}-next`,
                    source: flow.id as string,
                    target: node.id!,
                    data: {
                        color: "#ffffff",
                        type: 'default',
                        flowId: flowId,
                        parentNodeId: parentNode?.id
                    },
                    deletable: false,
                    selectable: false,
                });
            }

            if (parentNode?.id && !isParameter) {
                const startGroups = groupsWithValue.get(parentNode.id) ?? [];

                if (startGroups.length > 0) {
                    startGroups.forEach((gId, idx) => edges.push({
                        id: `${gId}-${node.id}-next-${idx}`,
                        source: gId,
                        target: node.id!,
                        data: {
                            color: "#ffffff",
                            type: 'default',
                            flowId: flowId,
                            parentNodeId: parentNode?.id
                        },
                        deletable: false,
                        selectable: false,
                    }));
                } else {
                    edges.push({
                        id: `${parentNode.id}-${node.id}-next`,
                        source: parentNode.id,
                        target: node.id!,
                        data: {
                            color: "#ffffff",
                            type: 'default',
                            flowId: flowId,
                            parentNodeId: parentNode.id
                        },
                        deletable: false,
                        selectable: false,
                    });
                }
            }

            node.parameters?.nodes?.forEach((param) => {
                const parameterValue = param?.value;
                const parameterDefinition = functionService.getById(node.functionDefinition?.id!!)?.parameterDefinitions?.find(p => p.id === param?.parameterDefinition?.id);
                const parameterDataTypeIdentifier = parameterDefinition?.dataTypeIdentifier;
                const parameterDataType = parameterDataTypeIdentifier ? dataTypeService.getDataType(parameterDataTypeIdentifier) : undefined;

                if (!parameterValue) return

                if (parameterDataType?.variant === "NODE") {
                    if (parameterValue && parameterValue.__typename === "NodeFunctionIdWrapper") {

                        const groupId = `${node.id}-group-${idCounter++}`;

                        edges.push({
                            id: `${node.id}-${groupId}-param-${param.id}`,
                            source: node.id!,
                            target: groupId,
                            deletable: false,
                            selectable: false,
                            animated: true,
                            label: parameterDefinition?.names!![0]?.content ?? param.id,
                            data: {
                                color: hashToColor(parameterValue?.id || ""),
                                type: 'group',
                                flowId: flowId,
                                parentNodeId: parentNode?.id
                            },
                        });

                        (groupsWithValue.get(node.id!) ?? (groupsWithValue.set(node.id!, []),
                            groupsWithValue.get(node.id!)!))
                            .push(groupId);

                        traverse(
                            flowService.getNodeById(flowId, parameterValue.id)!,
                            node,
                            true
                        );
                    }
                } else if (parameterValue && parameterValue.__typename === "NodeFunctionIdWrapper") {
                    const subFnId = traverse(
                        flowService.getNodeById(flowId, parameterValue.id)!,
                        node,
                        true
                    );

                    edges.push({
                        id: `${subFnId}-${node.id}-param-${param.id}`,
                        source: subFnId,
                        target: node.id!,
                        targetHandle: `param-${param.id}`,
                        animated: true,
                        deletable: false,
                        selectable: false,
                        data: {
                            color: hashToColor(parameterValue?.id || ""),
                            type: 'parameter',
                            flowId: flowId,
                            parentNodeId: parentNode?.id
                        },
                    });
                }
            });

            if (node.nextNodeId) {
                traverse(flowService.getNodeById(flow.id!!, node.nextNodeId!!)!!, node);
            }

            return node.id!;
        };

        if (flow.startingNodeId) {
            traverse(flowService.getNodeById(flow.id!!, flow.startingNodeId!!)!!, undefined, false);
        }

        return edges
    }, [flow, flowStore, functionStore, dataTypeStore]);
};