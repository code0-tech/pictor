import {useService} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {NodeFunction} from "../DFlow.view";
import {Node} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {EDataType} from "../data-type/DFlowDataType.view";

export const useFlowViewportNodes = (flowId: string): Node[] => {
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flow = flowService.getById(flowId);

    if (!flow) return [];

    const nodes: Node[] = [];
    let idCounter = 0;

    // GLOBAL, strictly increasing depth across the whole flow (no duplicates).
    // Depth 0 is reserved for the root lane. Every *group* created gets the next global depth.
    let globalDepthCounter = 0;
    const nextGlobalDepth = () => ++globalDepthCounter;

    // Per-depth running index for nodes. Resets automatically when we first visit a new depth.
    const depthIndex: Record<number, number> = {};
    const nextIndexForDepth = (d: number): number => {
        const i = depthIndex[d] ?? 1;
        depthIndex[d] = i + 1;
        return i;
    };

    const traverse = (
        fn: NodeFunction,
        isParameter = false,
        parentId?: string,
        depth: number = 0,
        scope: number = 0,
        parentGroup?: string
    ) => {
        const id = `${fn.runtime_id}-${idCounter++}`;
        const index = nextIndexForDepth(scope);

        nodes.push({
            id,
            type: "default",
            position: {x: 0, y: 0},
            draggable: false,
            parentId: parentGroup,
            extent: parentGroup ? "parent" : undefined,
            data: {
                ...fn.json,
                instance: fn,
                isParameter,
                linkingId: isParameter ? parentId : undefined,
                scope,
                depth,
                index,
            },
        });

        if (!fn.nextNode && !isParameter) {
            nodes.push({
                id: `${id}-suggestion`,
                type: "suggestion",
                position: {x: 0, y: 0},
                draggable: false,
                extent: parentGroup ? "parent" : undefined,
                parentId: parentGroup,
                data: {
                    flowId: flowId,
                    parentFunction: fn
                }
            });
        }

        const definition = functionService.getFunctionDefinition(fn.id);

        fn.parameters?.forEach((param, i) => {
            const paramType = definition?.parameters!!.find(p => p.parameter_id == param.id)?.type;
            const paramDataType = paramType ? dataTypeService.getDataType(paramType) : undefined;

            if (paramDataType?.type === EDataType.NODE) {
                if (param.value && param.value instanceof NodeFunction) {
                    const groupId = `${id}-group-${idCounter++}`;

                    // Each GROUP receives a new unique global depth (no duplicates anywhere).
                    const groupDepth = nextGlobalDepth();

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
                            depth: depth + 1,
                            scope: groupDepth
                        },
                    });

                    // Child function inside the group uses the group's depth (its lane).
                    traverse(param.value as NodeFunction, false, undefined, depth + 1, groupDepth, groupId);
                }
            } else if (param.value && param.value instanceof NodeFunction) {
                // Functions passed as non-NODE parameters live in the same depth/lane.
                traverse(param.value as NodeFunction, true, id, depth, scope, parentGroup);
            }
        });

        if (fn.nextNode) {
            // Linear chain continues in the same depth/lane.
            traverse(fn.nextNode, false, undefined, depth, scope, parentGroup);
        }
    };

    // Root lane is depth 0.
    traverse(flow.startingNode, false, undefined, 0, 0, undefined);
    return nodes;
};