import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "./DFlow.service";
import {Node} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import type {Flow, Namespace, NamespaceProject, NodeFunction} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {hashToColor} from "./DFlow.util";
import {DFlowNodeProps} from "../d-flow-node/DFlowNode";

const packageNodes = new Map<string, string>([
    ['std', 'default'],
]);

/**
 * Returns the value of the best-matching key from a Map<string, string>.
 *
 * Matching priority:
 *   1) Exact match
 *   2) Longest prefix match (with bonus if the prefix ends at a token boundary)
 *   3) Largest common prefix length (with small boundary bonus)
 *
 * Token boundaries are characters in /[:._\-\/\s]+/ (e.g., "::", ".", "_", "-", "/", whitespace).
 *
 * Performance:
 *   - O(N * M), where N = number of keys, M = average key length (string comparisons only).
 *
 */
const bestMatchValue = (map: Map<string, string>, input: string): string => {
    if (!input || map.size === 0) return ""

    const SEP = /[:._\-\/\s]+/;
    const normInput = input.trim().toLowerCase();

    let bestKey: string | null = null;
    let bestScore = -Infinity;

    for (const [key, value] of map.entries()) {
        const normKey = key.trim().toLowerCase();

        // (1) Exact match → immediately return (strongest possible score)
        if (normInput === normKey) {
            return value;
        }

        let score = 0;

        // (2) Prefix match
        if (normInput.startsWith(normKey)) {
            score = 2000 + normKey.length * 2;

            // Bonus if the prefix ends at a clean token boundary (or equals the whole input)
            const boundaryChar = normInput.charAt(normKey.length); // '' if out of range
            if (boundaryChar === "" || SEP.test(boundaryChar)) {
                score += 200;
            }
        } else {
            // (3) Largest common prefix (LCP)
            const max = Math.min(normInput.length, normKey.length);
            let lcp = 0;
            while (lcp < max && normInput.charCodeAt(lcp) === normKey.charCodeAt(lcp)) {
                lcp++;
            }
            if (lcp > 0) {
                score = 1000 + lcp;

                // Small bonus if LCP ends at a boundary on either side
                const inBoundaryChar = normInput.charAt(lcp);
                const keyBoundaryChar = normKey.charAt(lcp);
                if (
                    inBoundaryChar === "" ||
                    SEP.test(inBoundaryChar) ||
                    keyBoundaryChar === "" ||
                    SEP.test(keyBoundaryChar)
                ) {
                    score += 50;
                }
            }
        }

        // Best candidate so far? Tie-breaker favors longer key (more specific)
        if (score > bestScore) {
            bestScore = score;
            bestKey = key;
        } else if (score === bestScore && bestKey !== null && key.length > bestKey.length) {
            bestKey = key;
        } else if (score === bestScore && bestKey === null) {
            bestKey = key;
        }
    }

    return bestKey !== null ? map.get(bestKey)! : "";
};

// @ts-ignore
export const useFlowNodes = (flowId: Flow["id"], namespaceId?: Namespace["id"], projectId?: NamespaceProject["id"]): Node<DFlowNodeProps>[] => {

    const flowService = useService(DFlowReactiveService);
    const flowStore = useStore(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);

    const flow = React.useMemo(() => flowService.getById(flowId, {namespaceId, projectId}), [flowId, flowStore]);

    return React.useMemo(() => {
        if (!flow) return [];

        const nodes: Node<DFlowNodeProps>[] = [];
        const visited = new Set<string>();

        let groupCounter = 0;
        let globalIndex = 0;

        // Trigger node (ID == flow.id -> edge compatible)
        nodes.push({
            id: `${flow.id}`,
            type: "trigger",
            position: {x: 0, y: 0},
            draggable: false,
            data: {
                flowId: flowId,
                nodeId: undefined,
                color: hashToColor(flowId!),
            },
        });

    const traverse = (
        node: NodeFunction,
        isParameter = false,
        parentNodeId?: NodeFunction['id'],
        parentGroup?: string,
        parameterGroupId?: string
    ) => {
            if (!node?.id) return;

            const nodeId = node.id;

            if (!visited.has(nodeId)) {
                visited.add(nodeId);

                // Die parentId bestimmt die visuelle Gruppe (React Flow)
                // Eine Node kann nur in EINER Gruppe sein - entweder parameterGroup oder parentGroup
                const visualParentId = parentGroup ?? parameterGroupId;

                nodes.push({
                    id: nodeId,
                    type: bestMatchValue(packageNodes, node.functionDefinition?.identifier ?? ""),
                    position: {x: 0, y: 0},
                    draggable: false,
                    parentId: visualParentId,
                    extent: visualParentId ? "parent" : undefined,
                    data: {
                        nodeId: nodeId,
                        isParameter: isParameter,
                        flowId: flowId,
                        parentNodeId: isParameter ? parentNodeId : undefined,
                        index: ++globalIndex,
                        color: hashToColor(nodeId),
                    },
                });
            }

            const definition = node.functionDefinition?.id
                ? functionService.getById(node.functionDefinition.id)
                : undefined;

            node.parameters?.nodes?.forEach(param => {
                const value = param?.value;
                if (!value || value.__typename !== "NodeFunctionIdWrapper") return;

                const paramDef = definition?.parameterDefinitions?.find(p => p.id === param?.id);
                const dataType = paramDef?.dataTypeIdentifier
                    ? dataTypeService.getDataType(paramDef.dataTypeIdentifier)
                    : undefined;
                const isParameterGroup = dataType?.variant !== "NODE";
                const activeParameterGroupId = parameterGroupId ?? (!isParameter && isParameterGroup ? `${nodeId}-params-${param?.id}` : undefined);
                const parameterParentId = activeParameterGroupId ?? parentGroup;

                if (activeParameterGroupId && !parameterGroupId && !isParameter && isParameterGroup) {
                    if (!visited.has(activeParameterGroupId)) {
                        visited.add(activeParameterGroupId);

                        nodes.push({
                            id: activeParameterGroupId,
                            type: "parameterGroup",
                            position: {x: 0, y: 0},
                            draggable: false,
                            parentId: parentGroup,
                            extent: parentGroup ? "parent" : undefined,
                            data: {
                                isParameter: true,
                                parentNodeId: nodeId,
                                nodeId: nodeId,
                                flowId: flowId,
                                color: hashToColor(value.id!),
                            },
                        });
                    }
                }

                if (dataType?.variant === "NODE") {
                    const groupId = `${nodeId}-group-${groupCounter++}`;

                    if (!visited.has(groupId)) {
                        visited.add(groupId);

                        nodes.push({
                            id: groupId,
                            type: "group",
                            position: {x: 0, y: 0},
                            draggable: false,
                            parentId: parameterParentId,
                            extent: parameterParentId ? "parent" : undefined,
                            data: {
                                isParameter: true,
                                parentNodeId: nodeId,
                                nodeId: nodeId,
                                flowId: flowId,
                                color: hashToColor(value.id!),
                            },
                        });
                    }

                    const child = flowService.getNodeById(flowId, value.id);
                    if (child) traverse(child, false, undefined, groupId, activeParameterGroupId);
                } else {
                    const child = flowService.getNodeById(flowId, value.id);
                    if (child) traverse(child, true, nodeId, parameterParentId, activeParameterGroupId);
                }
            });

            if (node.nextNodeId) {
                const next = flowService.getNodeById(flow.id, node.nextNodeId);
                if (next) traverse(next, false, undefined, parentGroup, parameterGroupId);
            }
        };

        if (flow.startingNodeId) {
            const start = flowService.getNodeById(flow.id, flow.startingNodeId);
            if (start) traverse(start);
        }

        console.log(nodes)
        return nodes;
    }, [flow, flowStore]);
};
