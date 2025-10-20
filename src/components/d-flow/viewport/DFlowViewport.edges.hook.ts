import {useService, useStore} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {Edge} from "@xyflow/react";
import {NodeFunctionView} from "../DFlow.view";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import React from "react";
import {DataTypeIdentifier, DataTypeVariant, Scalars} from "@code0-tech/sagittarius-graphql-types";

// Deine Primärfarbe als Start, danach harmonisch verteilt
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

export const useFlowViewportEdges = (flowId: string): Edge[] => {
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flow = flowService.getById(flowId);
    const flowStore = useStore(DFlowReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    if (!flow) return [];

    /* ------------------------------------------------------------------ */
    const edges: Edge[] = [];

    /** merkt sich für jede Function-Card die Gruppen-IDs,
     *  **für die wirklich ein Funktions-Wert existiert**      */
    const groupsWithValue = new Map<string, string[]>();

    let idCounter = 0;              // globale, fortlaufende Id-Vergabe

    const functionCache = new Map<string, ReturnType<typeof functionService.getFunctionDefinition>>();
    const dataTypeCache = new Map<DataTypeIdentifier, ReturnType<typeof dataTypeService.getDataType>>();

    const getFunctionDefinitionCached = (
        id: Scalars['FunctionDefinitionID']['output'],
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

    /* ------------------------------------------------------------------ */
    const traverse = (
        fn: NodeFunctionView,
        parentFnId?: string,        // Id der *Function-Card* des Aufrufers
        level = 0,                  // Tiefe ⇒ Farbe aus dem Rainbow-Array,
        fnCache = functionCache,
        dtCache = dataTypeCache,
    ): string => {

        /* ------- Id der aktuellen Function-Card im Diagramm ---------- */
        const fnId = `${fn.runtime_id}-${idCounter++}`;

        if (idCounter == 1) {
            // erste Function-Card → Verbindung Trigger → Function
            edges.push({
                id: `trigger-${fnId}-next`,
                source: flow.id,    // Handle-Bottom des Trigger-Nodes
                target: fnId,       // Handle-Top der Function-Card
                data: {
                    color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                    isParameter: false
                },
                deletable: false,
                selectable: false,
            });
        }

        /* ------- vertikale Kante (nextNode) -------------------------- */
        if (parentFnId) {
            const startGroups = groupsWithValue.get(parentFnId) ?? [];

            if (startGroups.length > 0) {
                startGroups.forEach((gId, idx) => edges.push({
                    id: `${gId}-${fnId}-next-${idx}`,
                    source: gId,           // Handle-Bottom der Group-Card
                    target: fnId,          // Handle-Top der Function-Card
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
                    source: parentFnId,    // Handle-Bottom der Function-Card
                    target: fnId,          // Handle-Top der Function-Card
                    data: {
                        color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                        isParameter: false
                    },
                    deletable: false,
                    selectable: false,
                });
            }
        }

        /* ------- horizontale Kanten für Parameter -------------------- */
        fn.parameters?.forEach((param) => {
            const val = param.value;
            const def = getFunctionDefinitionCached(fn.id, fnCache)
                ?.parameters?.find(p => p.parameter_id === param.id);
            const paramType = def?.type;
            const paramDT = paramType ? getDataTypeCached(paramType, dtCache) : undefined;

            if (!val) return

            /* --- NODE-Parameter → Group-Card ------------------------- */
            if (paramDT?.variant === DataTypeVariant.Node) {
                const groupId = `${fnId}-group-${idCounter++}`;

                /* Verbindung Gruppe  → Function-Card (horizontal)       */
                edges.push({
                    id: `${fnId}-${groupId}-param-${param.id}`,
                    source: fnId,        // FunctionCard (Quelle)
                    target: groupId,     // GroupCard (Ziel – hat Top: target)
                    deletable: false,
                    selectable: false,
                    label: param.id,
                    data: {
                        color: FLOW_EDGE_RAINBOW[level % FLOW_EDGE_RAINBOW.length],
                        isParameter: false,
                    },
                });

                /* existiert ein Funktions-Wert für dieses Param-Feld?   */
                if (val && val instanceof NodeFunctionView) {
                    /* merken: diese Group-Card besitzt Content – das ist
                       später Startpunkt der next-Kante                   */
                    (groupsWithValue.get(fnId) ?? (groupsWithValue.set(fnId, []),
                        groupsWithValue.get(fnId)!))
                        .push(groupId);

                    /* rekursiv Funktions-Ast innerhalb der Gruppe       */
                    traverse(param.value as NodeFunctionView,
                        undefined,
                        level + 1,
                        fnCache,
                        dtCache);
                }
            }

            /* --- anderer Parameter, der selbst eine Function hält ---- */
            else if (val && val instanceof NodeFunctionView) {
                const subFnId = traverse(param.value as NodeFunctionView,
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

        /* ------- Rekursion auf nextNode ------------------------------ */
        if (fn.nextNode) {
            traverse(fn.nextNode, fnId, level, fnCache, dtCache);   // gleiche Ebenentiefe
        } else {
            // letzte Function-Card im Ast → Add-new-node wie *normale* nextNode behandeln
            const suggestionNodeId = `${fnId}-suggestion`;
            const startGroups = groupsWithValue.get(fnId) ?? [];

            if (startGroups.length > 0) {
                startGroups.forEach((gId, idx) => edges.push({
                    id: `${gId}-${suggestionNodeId}-next-${idx}`,
                    source: gId,                  // wie bei echter nextNode von Group-Card starten
                    target: suggestionNodeId,     // Ziel ist die Suggestion-Card
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
                    source: fnId,                 // Handle-Bottom der Function-Card
                    target: suggestionNodeId,     // Handle-Top der Suggestion-Card
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

    /* ------------------------------------------------------------------ */
    traverse(flow.startingNode, undefined, 0, functionCache, dataTypeCache);

    return React.useMemo(() => edges, [flowStore, functionStore, dataTypeStore, edges]);
};