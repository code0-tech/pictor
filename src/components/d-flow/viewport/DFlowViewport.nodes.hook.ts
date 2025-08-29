import {useService} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {NodeFunction} from "../DFlow.view";
import {Node} from "@xyflow/react";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {EDataType, Type} from "../data-type/DFlowDataType.view";

export const useFlowViewportNodes = (flowId: string): Node[] => {
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flow = flowService.getById(flowId);

    if (!flow) return [];

    const nodes: Node[] = [];
    let idCounter = 0;

    const functionCache = new Map<string, ReturnType<typeof functionService.getFunctionDefinition>>();
    const dataTypeCache = new Map<Type, ReturnType<typeof dataTypeService.getDataType>>();

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
        type: Type,
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
        fn: NodeFunction,
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
            type: "default",
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

            if (paramDataType?.type === EDataType.NODE) {
                if (param.value && param.value instanceof NodeFunction) {
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
                    traverse(param.value as NodeFunction, false, undefined, depth + 1, childScopePath, groupId, fnCache, dtCache);
                }
            } else if (param.value && param.value instanceof NodeFunction) {
                // Functions passed as non-NODE parameters live in the same depth/scope PATH.
                traverse(param.value as NodeFunction, true, id, depth, scopePath, parentGroup, fnCache, dtCache);
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