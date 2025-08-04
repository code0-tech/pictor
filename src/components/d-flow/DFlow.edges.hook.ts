import {useService} from "../../utils/contextStore";
import {DFlowReactiveService} from "./DFlow.service";
import {Edge} from "@xyflow/react";
import {isNodeFunctionObject, NodeFunction, NodeFunctionObject, NodeFunctionParameter} from "./DFlow.view";
import {DFlowFunctionReactiveService} from "./function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "./data-type/DFlowDataType.service";
import {EDataType} from "./data-type/DFlowDataType.view";

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

export const useFlowEdges = (flowId: string): Edge[] => {
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flow = flowService.getById(flowId);

    if (!flow) return [];

    const edges: Edge[] = [];
    let idCounter = 0;

    /**
     * Traverses the NodeFunction tree recursively,
     * assigns color by current parameter depth (level)
     * and adds edges for both vertical (nextNode) and horizontal (parameter) connections.
     */
    const traverse = (fn: NodeFunction, parentId?: string, paramLevel: number = 0): string => {
        const currentId = `${fn.runtime_id}-${idCounter++}`;

        // --- Vertikale Verbindung (z.B. nextNode)
        if (parentId) {
            edges.push({
                id: `${parentId}-${currentId}`,
                source: parentId,
                target: currentId,
                // Vertical edges always use the rainbow index for "main" level
                data: {color: FLOW_EDGE_RAINBOW[paramLevel % FLOW_EDGE_RAINBOW.length]},
            });
        }

        // --- Parameter-Verbindungen (horizontal)
        fn.parameters?.forEach((param: NodeFunctionParameter) => {
            const val = param.value;
            const definition = functionService
                .getFunctionDefinition(fn.id)?.parameters?.find(p => p.parameter_id === param.id);
            const paramType = definition?.type;
            const paramDataType = paramType ? dataTypeService.getDataType(paramType) : undefined;

            if (paramDataType?.type === EDataType.NODE) {
                const groupId = `${currentId}-group-${idCounter++}`;
                edges.push({
                    id: `${groupId}-${currentId}-param-${param.id}`,
                    source: groupId,
                    target: currentId,
                    targetHandle: `param-${param.id}`,
                    animated: true,
                    deletable: false,
                    selectable: false,
                    data: {color: FLOW_EDGE_RAINBOW[(paramLevel + 1) % FLOW_EDGE_RAINBOW.length], isParameter: true},
                });
                if (val && isNodeFunctionObject(val as NodeFunctionObject)) {
                    const subFn = new NodeFunction(val as NodeFunctionObject);
                    traverse(subFn, groupId, paramLevel + 1);
                }
            } else if (val && isNodeFunctionObject(val as NodeFunctionObject)) {
                const subFn = new NodeFunction(val as NodeFunctionObject);
                const subId = traverse(subFn, undefined, paramLevel + 1);
                edges.push({
                    id: `${subId}-${currentId}-param-${param.id}`,
                    source: subId,
                    target: currentId,
                    targetHandle: `param-${param.id}`,
                    animated: true,
                    deletable: false,
                    selectable: false,
                    data: {color: FLOW_EDGE_RAINBOW[(paramLevel + 1) % FLOW_EDGE_RAINBOW.length], isParameter: true},
                });
            }
        });

        // --- Nächster Funktions-Node (vertikal)
        if (fn.nextNode) {
            traverse(fn.nextNode, currentId, paramLevel); // Vertikal: gleiche Ebene behalten
        }

        return currentId;
    };

    traverse(flow.startingNode);

    return edges;
};