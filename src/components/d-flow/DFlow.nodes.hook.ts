import {useService} from "../../utils/contextStore";
import {DFlowReactiveService} from "./DFlow.service";
import {isNodeFunctionObject, NodeFunction, NodeFunctionObject} from "./DFlow.view";
import {Node} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "./function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "./data-type/DFlowDataType.service";
import {EDataType} from "./data-type/DFlowDataType.view";

export const useFlowNodes = (flowId: string): Node[] => {
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flow = flowService.getById(flowId);

    if (!flow) return [];

    const nodes: Node[] = [];
    let idCounter = 0;

    const traverse = (
        fn: NodeFunction,
        isParameter = false,
        parentId?: string,
        depth: number = 0,
        parentGroup?: string
    ) => {
        const id = `${fn.runtime_id}-${idCounter++}`;

        nodes.push({
            id,
            type: "default",
            position: {x: 0, y: 0},
            draggable: false,
            parentId: parentGroup,
            extent: parentGroup ? "parent" : undefined,   //  <-- NEU
            data: {
                ...fn.json,
                instance: fn,
                isParameter,
                linkingId: isParameter ? parentId : undefined,
                depth
            },
        });

        const definition = functionService.getFunctionDefinition(fn.id);

        fn.parameters?.forEach((param, i) => {
            const paramType = definition?.parameters!!.find(p => p.parameter_id == param.id)?.type;
            const paramDataType = paramType ? dataTypeService.getDataType(paramType) : undefined;

            if (paramDataType?.type === EDataType.NODE) {
                if (param.value && param.value instanceof NodeFunction) {
                    const groupId = `${id}-group-${idCounter++}`;
                    nodes.push({
                        id: groupId,
                        type: "group",
                        position: {x: 0, y: 0},
                        draggable: false,
                        parentId: parentGroup,
                        extent: parentGroup ? "parent" : undefined,   //  <-- NEU
                        data: {
                            isParameter: true,
                            linkingId: id,
                            depth: depth + 1,
                        },
                    });
                    traverse(param.value as NodeFunction, false, undefined, depth + 1, groupId);
                }
            } else if (param.value && param.value instanceof NodeFunction) {
                traverse(param.value as NodeFunction, true, id, depth, parentGroup);
            }
        });

        if (fn.nextNode) {
            traverse(fn.nextNode, false, undefined, depth, parentGroup);
        }
    };

    traverse(flow.startingNode);
    return nodes;
};