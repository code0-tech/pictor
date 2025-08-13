import {useService} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {Edge} from "@xyflow/react";
import {NodeFunction} from "../DFlow.view";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {EDataType} from "../data-type/DFlowDataType.view";

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

    if (!flow) return [];

    /* ------------------------------------------------------------------ */
    const edges: Edge[] = [];

    /** merkt sich für jede Function-Card die Gruppen-IDs,
     *  **für die wirklich ein Funktions-Wert existiert**      */
    const groupsWithValue = new Map<string, string[]>();

    let idCounter = 0;              // globale, fortlaufende Id-Vergabe

    /* ------------------------------------------------------------------ */
    const traverse = (
        fn: NodeFunction,
        parentFnId?: string,        // Id der *Function-Card* des Aufrufers
        level = 0,                  // Tiefe ⇒ Farbe aus dem Rainbow-Array
    ): string => {

        /* ------- Id der aktuellen Function-Card im Diagramm ---------- */
        const fnId = `${fn.runtime_id}-${idCounter++}`;

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
            const def = functionService
                .getFunctionDefinition(fn.id)
                ?.parameters?.find(p => p.parameter_id === param.id);
            const paramType = def?.type;
            const paramDT = paramType ? dataTypeService.getDataType(paramType) : undefined;

            if (!val) return

            /* --- NODE-Parameter → Group-Card ------------------------- */
            if (paramDT?.type === EDataType.NODE) {
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
                if (val && val instanceof NodeFunction) {
                    /* merken: diese Group-Card besitzt Content – das ist
                       später Startpunkt der next-Kante                   */
                    (groupsWithValue.get(fnId) ?? (groupsWithValue.set(fnId, []),
                        groupsWithValue.get(fnId)!))
                        .push(groupId);

                    /* rekursiv Funktions-Ast innerhalb der Gruppe       */
                    traverse(param.value as NodeFunction,
                        undefined,
                        level + 1);
                }
            }

            /* --- anderer Parameter, der selbst eine Function hält ---- */
            else if (val && val instanceof NodeFunction) {
                const subFnId = traverse(param.value as NodeFunction,
                    undefined,
                    level + 1);

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
            traverse(fn.nextNode, fnId, level);   // gleiche Ebenentiefe
        }

        return fnId;
    };

    /* ------------------------------------------------------------------ */
    traverse(flow.startingNode);
    return edges;
};