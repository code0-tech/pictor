import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "./DFlow.service";
import {Edge} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "./function";
import {DFlowDataTypeReactiveService} from "./data-type";
import React from "react";
import type {DataTypeIdentifier, Flow, NodeFunction, Scalars} from "@code0-tech/sagittarius-graphql-types";

export const FLOW_EDGE_RAINBOW: string[] = [
    '#70ffb2', // 0 – Primary (Grün)
    '#70e2ff', // 1 – Cyan
    '#709aff', // 2 – Blau
    '#a170ff', // 3 – Violett
    '#f170ff', // 4 – Magenta
    '#ff70b5', // 5 – Pink/Rot
    '#ff7070', // 6 – Orange-Rot
    '#fff170', // 7 – Gelb
];

export const useFlowEdges = (flowId: Flow['id']): Edge[] => {
    const flowService = useService(DFlowReactiveService);
    const flowStore = useStore(DFlowReactiveService)
    const functionService = useService(DFlowFunctionReactiveService);
    const functionStore = useStore(DFlowFunctionReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore])

    return React.useMemo(() => {
        if (!flow) return [];

        /* ------------------------------------------------------------------ */
        const edges: Edge[] = [];

        /** merkt sich für jede Function-Card die Gruppen-IDs,
         *  **für die wirklich ein Funktions-Wert existiert**      */
        const groupsWithValue = new Map<string, string[]>();

        let idCounter = 0;              // globale, fortlaufende Id-Vergabe

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
            fn: NodeFunction,
            parentFnId?: string,
            level = 0,
            fnCache = functionCache,
            dtCache = dataTypeCache,
        ): string => {

            const fnId = `${fn.id}-${idCounter++}`;

            if (idCounter == 1) {
                edges.push({
                    id: `trigger-${fnId}-next`,
                    source: flow.id as string,
                    target: fnId,
                    data: {
                        color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                        isParameter: false
                    },
                    deletable: false,
                    selectable: false,
                });
            }

            if (parentFnId) {
                const startGroups = groupsWithValue.get(parentFnId) ?? [];

                if (startGroups.length > 0) {
                    startGroups.forEach((gId, idx) => edges.push({
                        id: `${gId}-${fnId}-next-${idx}`,
                        source: gId,
                        target: fnId,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            isParameter: false
                        },
                        deletable: false,
                        selectable: false,
                    }));
                } else {
                    edges.push({
                        id: `${parentFnId}-${fnId}-next`,
                        source: parentFnId,
                        target: fnId,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            isParameter: false
                        },
                        deletable: false,
                        selectable: false,
                    });
                }
            }

            fn.parameters?.nodes?.forEach((param) => {
                const val = param?.value;
                const def = getFunctionDefinitionCached(fn.functionDefinition?.id!!, fnCache)
                    ?.parameterDefinitions?.find(p => p.id === param?.id);
                const paramType = def?.dataTypeIdentifier;
                const paramDT = paramType ? getDataTypeCached(paramType, dtCache) : undefined;

                if (!val) return

                if (paramDT?.variant === "NODE") {
                    const groupId = `${fnId}-group-${idCounter++}`;

                    edges.push({
                        id: `${fnId}-${groupId}-param-${param.id}`,
                        source: fnId,
                        target: groupId,
                        deletable: false,
                        selectable: false,
                        label: def?.names?.nodes!![0]?.content ?? param.id,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            isParameter: false,
                        },
                    });


                    if (val && val.__typename === "NodeFunction") {

                        (groupsWithValue.get(fnId) ?? (groupsWithValue.set(fnId, []),
                            groupsWithValue.get(fnId)!))
                            .push(groupId);

                        traverse(param.value as NodeFunction,
                            undefined,
                            level + 1,
                            fnCache,
                            dtCache);
                    }
                } else if (val && val.__typename === "NodeFunction") {
                    const subFnId = traverse(param.value as NodeFunction,
                        undefined,
                        level + 1,
                        fnCache,
                        dtCache);

                    edges.push({
                        id: `${subFnId}-${fnId}-param-${param.id}`,
                        source: subFnId,
                        target: fnId,
                        targetHandle: `param-${param.id}`,
                        animated: true,
                        deletable: false,
                        selectable: false,
                        data: {
                            color: FLOW_EDGE_RAINBOW[(level + 1) % FLOW_EDGE_RAINBOW.length],
                            isParameter: true
                        },
                    });
                }
            });

            if (fn.nextNodeId) {
                traverse(flowService.getNodeById(flow.id!!, fn.nextNodeId!!)!!, fnId, level, fnCache, dtCache);   // gleiche Ebenentiefe
            } else {
                const suggestionNodeId = `${fnId}-suggestion`;
                const startGroups = groupsWithValue.get(fnId) ?? [];

                if (startGroups.length > 0) {
                    startGroups.forEach((gId, idx) => edges.push({
                        id: `${gId}-${suggestionNodeId}-next-${idx}`,
                        source: gId,
                        target: suggestionNodeId,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            isSuggestion: true,
                        },
                        deletable: false,
                        selectable: false,
                    }));
                } else {
                    edges.push({
                        id: `${fnId}-${suggestionNodeId}-next`,
                        source: fnId,
                        target: suggestionNodeId,
                        data: {
                            color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                            isSuggestion: true,
                        },
                        deletable: false,
                        selectable: false,
                    });
                }
            }

            return fnId;
        };

        if (flow.startingNodeId) {
            traverse(flowService.getNodeById(flow.id!!, flow.startingNodeId!!)!!, undefined, 0, functionCache, dataTypeCache);
        }

        return edges
    }, [flow, flowStore, functionStore, dataTypeStore]);
};