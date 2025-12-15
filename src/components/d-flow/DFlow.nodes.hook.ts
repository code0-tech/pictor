import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "./DFlow.service";
import {Node} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "./function";
import {DFlowDataTypeReactiveService} from "./data-type";
import type {
    DataTypeIdentifier,
    Flow,
    NodeFunction,
    NodeFunctionIdWrapper,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {DFlowFunctionDefaultCardDataProps} from "./function/DFlowFunctionDefaultCard";
import {DFlowFunctionSuggestionCardDataProps} from "./function/DFlowFunctionSuggestionCard";
import {DFlowFunctionTriggerCardDataProps} from "./function/DFlowFunctionTriggerCard";
import {DFlowFunctionGroupCardDataProps} from "./function/DFlowFunctionGroupCard";
import {md5} from "js-md5";

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
export const useFlowNodes = (flowId: Flow['id']): Node<DFlowFunctionDefaultCardDataProps | DFlowFunctionSuggestionCardDataProps | DFlowFunctionTriggerCardDataProps | DFlowFunctionGroupCardDataProps>[] => {
    const flowService = useService(DFlowReactiveService);
    const flowStore = useStore(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const functionStore = useStore(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const dataTypeStore = useStore(DFlowDataTypeReactiveService);

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore])

    return React.useMemo(() => {
        if (!flow) return [];

        // @ts-ignore
        const nodes: Node<DFlowFunctionDefaultCardDataProps | DFlowFunctionSuggestionCardDataProps | DFlowFunctionTriggerCardDataProps | DFlowFunctionGroupCardDataProps>[] = [];
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

        // Global, strictly increasing group-id used to build the scope PATH ([0], [0,1], [0,2], [0,2,3], ...)
        let globalScopeId = 0;
        const nextScopeId = () => ++globalScopeId;

        // Global, strictly increasing node index across the entire flow (only real nodes)
        let globalNodeIndex = 0;

        //trigger node
        nodes.push({
            id: `${flow.id}`,
            type: "trigger",
            position: {x: 0, y: 0},
            draggable: false,
            data: {
                instance: flow,
                flowId,
            }
        })


        const traverse = (
            node: NodeFunction,
            isParameter = false,
            parentId?: string,
            depth: number = 0,
            scopePath: number[] = [0],
            parentGroup?: string,
            fnCache = functionCache,
            dtCache = dataTypeCache,
        ) => {
            const id = `${node.id}-${idCounter++}`;
            const index = ++globalNodeIndex; // global node level

            nodes.push({
                id,
                type: bestMatchValue(packageNodes, node.functionDefinition?.identifier!!),
                position: {x: 0, y: 0},
                draggable: false,
                parentId: parentGroup,
                extent: parentGroup ? "parent" : undefined,
                data: {
                    nodeId: node.id,
                    isParameter,
                    flowId: flowId!!,
                    linkingId: isParameter ? parentId : undefined,
                    scope: scopePath,   // scope is now a PATH (number[])
                    depth,              // structural depth (0 at root, +1 per group)
                    index,              // global node level
                },
            });

            const definition = getFunctionDefinitionCached(node.functionDefinition?.id!!, fnCache);

            node.parameters?.nodes?.forEach((param) => {
                const paramType = definition?.parameterDefinitions!!.find(p => p.id == param?.runtimeParameter?.id)?.dataTypeIdentifier;
                const paramDataType = paramType ? getDataTypeCached(paramType, dtCache) : undefined;

                if (paramDataType?.variant === "NODE") {
                    if (param?.value && param.value.__typename === "NodeFunctionIdWrapper") {
                        const groupId = `${id}-group-${idCounter++}`;

                        // New group: extend scope PATH with a fresh segment and increase depth.
                        const childScopePath = [...scopePath, nextScopeId()];

                        const hash = md5(`${id}-param-${JSON.stringify(param)}`)
                        const hashToHue = (md5: string): number => {
                            // nimm z.B. 8 Hex-Zeichen = 32 Bit
                            const int = parseInt(md5.slice(0, 8), 16)
                            return int % 360
                        }

                        nodes.push({
                            id: groupId,
                            type: "group",
                            position: {x: 0, y: 0},
                            draggable: false,
                            parentId: parentGroup,
                            extent: parentGroup ? "parent" : undefined,
                            data: {
                                isParameter: true,
                                linkingId: id,
                                flowId: flowId!!,
                                depth: depth + 1,
                                scope: childScopePath,
                                color: `hsl(${hashToHue(hash)}, 100%, 72%)`,
                            },
                        });

                        // Child function inside the group uses the group's depth and scope PATH.
                        traverse(flowService.getNodeById(flowId, param.value.id)!, false, undefined, depth + 1, childScopePath, groupId, fnCache, dtCache);
                    }
                } else if (param?.value && param.value.__typename === "NodeFunctionIdWrapper") {
                    // Functions passed as non-NODE parameters live in the same depth/scope PATH.
                    traverse(flowService.getNodeById(flowId, param.value.id)!, true, id, depth, scopePath, parentGroup, fnCache, dtCache);
                }
            });

            if (node.nextNodeId) {
                // Linear chain continues in the same depth/scope PATH.
                traverse(flowService.getNodeById(flow.id, node.nextNodeId)!!, false, undefined, depth, scopePath, parentGroup, fnCache, dtCache);
            }
        };

        // Root lane: depth 0, scope path [0]
        if (flow.startingNodeId) {
            traverse(flowService.getNodeById(flow.id, flow.startingNodeId)!!, false, undefined, 0, [0], undefined, functionCache, dataTypeCache);
        }
        return nodes;
    }, [flow, flowStore, functionStore, dataTypeStore])
};