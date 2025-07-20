import {useService} from "../../utils/contextStore";
import {DFlowReactiveService} from "./DFlow.service";
import React from "react";
import {Edge, MarkerType} from "@xyflow/react";
import {isNodeFunctionObject, NodeFunction, NodeFunctionObject, NodeFunctionParameter} from "./DFlow.view";

export const useFlowEdges = (flowId: string): Edge[] => {
    const flowService = useService(DFlowReactiveService);
    const flow = flowService.getById(flowId);

    return React.useMemo(() => {
        if (!flow) return [];

        const edges: Edge[] = [];
        let idCounter = 0;

        const traverse = (fn: NodeFunction, parentId?: string): string => {
            const currentId = `${fn.runtime_id}-${idCounter++}`;

            // Vertikale Verbindung zum Parent (z. B. nextNode)
            if (parentId) {
                edges.push({
                    id: `${parentId}-${currentId}`,
                    source: parentId,
                    target: currentId,
                });
            }

            // Parameter-Verbindungen (horizontal)
            fn.parameters?.forEach((param: NodeFunctionParameter) => {
                const val = param.value;

                if (val && isNodeFunctionObject(val as NodeFunctionObject)) {
                    const subFn = new NodeFunction(val as NodeFunctionObject);
                    const subId = traverse(subFn); // ID der Param-Node

                    edges.push({
                        id: `${subId}-${currentId}-param-${param.id}`,
                        source: subId,
                        target: currentId,
                        targetHandle: `param-${param.id}`, // ← Handle am Parent,
                        animated: true,
                        deletable: false,
                        selectable: false
                    });
                }
            });

            // Nächster Funktions-Node (vertikal)
            if (fn.nextNode) {
                traverse(fn.nextNode, currentId);
            }

            return currentId;
        };

        traverse(flow.startingNode);

        return edges;
    }, [flow]);
};