import {useService} from "../../utils/contextStore";
import {DFlowReactiveService} from "./DFlow.service";
import {isNodeFunctionObject, NodeFunction, NodeFunctionObject} from "./DFlow.view";
import {Node} from "@xyflow/react";

export const useFlowNodes = (flowId: string): Node[] => {
    const flowService = useService(DFlowReactiveService);
    const flow = flowService.getById(flowId);

    if (!flow) return [];

    const nodes: Node[] = [];
    let idCounter = 0;

    const traverse = (fn: NodeFunction, isParameter = false, parentId?: string) => {
        const id = `${fn.runtime_id}-${idCounter++}`;

        nodes.push({
            id,
            type: "default",
            position: {x: 0, y: 0},
            draggable: false,
            data: {
                ...fn.json,
                isParameter,
                parentId: isParameter ? parentId : undefined, // Nur für Parameter!
            },
        });

        fn.parameters?.forEach((param, i) => {
            if (param.value && isNodeFunctionObject(param.value as NodeFunctionObject)) {
                const subNode = new NodeFunction(param.value as NodeFunctionObject);
                traverse(subNode, true, id); // Parameter: isParameter=true, parentId gesetzt
            }
        });

        if (fn.nextNode) {
            traverse(fn.nextNode, false); // nextNode: isParameter=false, parentId NICHT setzen
        }
    };
    traverse(flow.startingNode);
    return nodes;
};