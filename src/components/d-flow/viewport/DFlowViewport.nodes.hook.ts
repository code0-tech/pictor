import {useService} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {NodeFunctionView} from "../DFlow.view";
import {Node} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {DataTypeIdentifier} from "@code0-tech/sagittarius-graphql-types";

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

export const useFlowViewportNodes = (flowId: string): Node[] => {
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flow = flowService.getById(flowId);

    if (!flow) return [];

    const nodes: Node[] = [];
    let idCounter = 0;

    const functionCache = new Map<string, ReturnType<typeof functionService.getFunctionDefinition>>();
    const dataTypeCache = new Map<DataTypeIdentifier, ReturnType<typeof dataTypeService.getDataType>>();

    const getFunctionDefinitionCached = (
        id: string,
        cache = functionCache,
    ) => {
        if (!cache.has(id)) {
            cache.set(id, functionService.getFunctionDefinition(id));
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
        position: { x: 0, y: 0 },
        draggable: false,
        data: {
            instance: flow
        }
    })

    const traverse = (
        fn: NodeFunctionView,
        isParameter = false,
        parentId?: string,
        depth: number = 0,
        scopePath: number[] = [0],
        parentGroup?: string,
        fnCache = functionCache,
        dtCache = dataTypeCache,
    ) => {
        const id = `${fn.runtime_id}-${idCounter++}`;
        const index = ++globalNodeIndex; // global node level

        nodes.push({
            id,
            type: bestMatchValue(packageNodes, fn.runtime_id),
            position: { x: 0, y: 0 },
            draggable: false,
            parentId: parentGroup,
            extent: parentGroup ? "parent" : undefined,
            data: {
                instance: fn,
                isParameter,
                linkingId: isParameter ? parentId : undefined,
                scope: scopePath,   // scope is now a PATH (number[])
                depth,              // structural depth (0 at root, +1 per group)
                index,              // global node level
            },
        });

        if (!fn.nextNode && !isParameter) {
            nodes.push({
                id: `${id}-suggestion`,
                type: "suggestion",
                position: { x: 0, y: 0 },
                draggable: false,
                extent: parentGroup ? "parent" : undefined,
                parentId: parentGroup,
                data: {
                    flowId: flowId,
                    parentFunction: fn,
                },
            });
        }

        const definition = getFunctionDefinitionCached(fn.id, fnCache);

        fn.parameters?.forEach((param) => {
            const paramType = definition?.parameters!!.find(p => p.parameter_id == param.id)?.type;
            const paramDataType = paramType ? getDataTypeCached(paramType, dtCache) : undefined;

            if (paramDataType?.variant === EDataType.NODE) {
                if (param.value && param.value instanceof NodeFunctionView) {
                    const groupId = `${id}-group-${idCounter++}`;

                    // New group: extend scope PATH with a fresh segment and increase depth.
                    const childScopePath = [...scopePath, nextScopeId()];

                    nodes.push({
                        id: groupId,
                        type: "group",
                        position: { x: 0, y: 0 },
                        draggable: false,
                        parentId: parentGroup,
                        extent: parentGroup ? "parent" : undefined,
                        data: {
                            isParameter: true,
                            linkingId: id,
                            depth: depth + 1,
                            scope: childScopePath,
                        },
                    });

                    // Child function inside the group uses the group's depth and scope PATH.
                    traverse(param.value as NodeFunctionView, false, undefined, depth + 1, childScopePath, groupId, fnCache, dtCache);
                }
            } else if (param.value && param.value instanceof NodeFunctionView) {
                // Functions passed as non-NODE parameters live in the same depth/scope PATH.
                traverse(param.value as NodeFunctionView, true, id, depth, scopePath, parentGroup, fnCache, dtCache);
            }
        });

        if (fn.nextNode) {
            // Linear chain continues in the same depth/scope PATH.
            traverse(fn.nextNode, false, undefined, depth, scopePath, parentGroup, fnCache, dtCache);
        }
    };

    // Root lane: depth 0, scope path [0]
    traverse(flow.startingNode, false, undefined, 0, [0], undefined, functionCache, dataTypeCache);
    return nodes;
};