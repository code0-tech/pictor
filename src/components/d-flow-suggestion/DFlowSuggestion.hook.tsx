import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {isMatchingType, replaceGenericsAndSortType, resolveType} from "../../utils/generics";
import {DFlowReactiveService} from "../d-flow";
import {useReturnType} from "../d-flow-function/DFlowFunction.return.hook";
import React from "react";
import type {
    DataTypeIdentifier,
    DataTypeRulesItemOfCollectionConfig,
    DataTypeRulesNumberRangeConfig,
    Flow,
    LiteralValue,
    Maybe,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameter,
    NodeParameterValue,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";

//TODO: deep type search
//TODO: calculate FUNCTION_COMBINATION deepness max 2

export const useSuggestions = (
    type: DataTypeIdentifier | undefined,
    genericKeys: string[] | undefined,
    flowId: Flow['id'],
    depth: number = 0,
    scope: number[] = [0],
    node: number = 1,
    suggestionTypes: DFlowSuggestionType[] = [DFlowSuggestionType.REF_OBJECT, DFlowSuggestionType.VALUE, DFlowSuggestionType.FUNCTION, DFlowSuggestionType.FUNCTION_COMBINATION, DFlowSuggestionType.DATA_TYPE]
): DFlowSuggestion[] => {

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const dataType = type ? dataTypeService?.getDataType(type) : undefined

    const resolvedType = type ? replaceGenericsAndSortType(resolveType(type, dataTypeService), genericKeys) : undefined
    const state: DFlowSuggestion[] = []


    if (dataType && suggestionTypes.includes(DFlowSuggestionType.VALUE)) {
        //calculate VALUE
        dataType.rules?.nodes?.forEach(rule => {
            if (rule?.variant === "ITEM_OF_COLLECTION") {
                (rule.config as DataTypeRulesItemOfCollectionConfig)!!.items?.forEach(value => {
                    const suggestion: DFlowSuggestion = {
                        path: [],
                        type: DFlowSuggestionType.VALUE,
                        displayText: [value.toString()],
                        value: {
                            __typename: "LiteralValue",
                            value: value
                        },
                    }
                    state.push(suggestion)
                })
            } else if (rule?.variant === "NUMBER_RANGE") {
                const config: DataTypeRulesNumberRangeConfig = rule.config as DataTypeRulesNumberRangeConfig
                console.log(config)
                if (config.from  === null || config.from  === undefined) return
                if (config.to  === null || config.to  === undefined) return

                for (let i = config.from; i <= config.to; i += (config.steps ?? 1)) {
                    const suggestion: DFlowSuggestion = {
                        path: [],
                        type: DFlowSuggestionType.VALUE,
                        displayText: [i.toString() ?? ""],
                        value: {
                            __typename: "LiteralValue",
                            value: i
                        },
                    }
                    state.push(suggestion)
                }
            }
        })
    }

    //TODO: need to validate given type
    if (dataType && dataType.variant === "DATA_TYPE" && suggestionTypes.includes(DFlowSuggestionType.DATA_TYPE)) {
        dataTypeService.values().forEach(dataType => {
            //TODO: need to wait for sagittarius update to support DataTypes as values
            const suggestion: DFlowSuggestion = {
                path: [],
                type: DFlowSuggestionType.DATA_TYPE,
                displayText: [dataType.name?.nodes!![0]?.content!],
                /*@ts-ignore*/
                value: dataType.json,
            }
            state.push(suggestion)
        })
    }

    if (suggestionTypes.includes(DFlowSuggestionType.REF_OBJECT)) {
        //calculate REF_OBJECTS && FUNCTION_COMBINATION
        const refObjects = type ? useRefObjects(flowId) : []
        console.log("refObjects", node, refObjects)

        refObjects.forEach(value => {
            if (value.node === null || value.node === undefined) return
            if (value.depth === null || value.depth === undefined) return
            if (value.scope === null || value.scope === undefined) return
            if (value.node >= node) return
            if (value.depth > depth) return
            if (value.scope.some(r => !scope.includes(r))) return
            if (!resolvedType) return

            const resolvedRefObjectType = replaceGenericsAndSortType(resolveType(value.dataTypeIdentifier!!, dataTypeService), [])
            if (!isMatchingType(resolvedType, resolvedRefObjectType)) return

            const suggestion: DFlowSuggestion = {
                path: [],
                type: DFlowSuggestionType.REF_OBJECT,
                displayText: [`${value.depth}-${value.scope}-${value.node || ''}`],
                value: value as ReferenceValue,
            }
            state.push(suggestion)
        })
    }


    if (suggestionTypes.includes(DFlowSuggestionType.FUNCTION_COMBINATION)) {
        //calculate FUNCTION
        //generics to be replaced with GENERIC todo is written on top
        const matchingFunctions = functionService.values().filter(funcDefinition => {
            if (!type || !resolvedType) return true
            if (funcDefinition.runtimeFunctionDefinition?.identifier == "std::control::return" && type) return false
            if (dataType?.variant === "NODE") return true
            if (!funcDefinition.returnType) return false
            if (!funcDefinition.genericKeys) return false
            const resolvedReturnType = replaceGenericsAndSortType(resolveType(funcDefinition.returnType, dataTypeService), funcDefinition.genericKeys)
            return isMatchingType(resolvedType, resolvedReturnType)
        }).sort((a, b) => {
            const [rA, pA, fA] = a.runtimeFunctionDefinition!!.identifier!!.split("::");
            const [rB, pB, fB] = b.runtimeFunctionDefinition!!.identifier!!.split("::");

            // Erst runtime vergleichen
            const runtimeCmp = rA.localeCompare(rB);
            if (runtimeCmp !== 0) return runtimeCmp;

            // Dann package vergleichen
            const packageCmp = pA.localeCompare(pB);
            if (packageCmp !== 0) return packageCmp;

            // Dann function name
            return fA.localeCompare(fB);
        })

        matchingFunctions.forEach(funcDefinition => {
            const nodeFunctionSuggestion: LiteralValue | ReferenceValue | NodeFunction = {
                __typename: "NodeFunction",
                id: `gid://sagittarius/NodeFunction/1`,
                functionDefinition: {
                    id: funcDefinition.id,
                    runtimeFunctionDefinition: funcDefinition.runtimeFunctionDefinition
                },
                parameters: {
                    nodes: (funcDefinition.parameterDefinitions?.map(definition => {
                        return {
                            id: definition.id,
                            runtimeParameter: {
                                id: definition.id
                            }
                        }
                    }) ?? []) as Maybe<Array<Maybe<NodeParameter>>>
                }
            }
            const suggestion: DFlowSuggestion = {
                path: [],
                type: DFlowSuggestionType.FUNCTION,
                displayText: [funcDefinition.names?.nodes!![0]?.content as string],
                value: nodeFunctionSuggestion,
            }
            state.push(suggestion)
        })
    }

    return state.sort()

}

/**
 * Walks the flow starting at its startingNode (depth-first, left-to-right) and collects
 * all RefObjects (variables/outputs) with contextual metadata:
 *  - depth: nesting level (root 0; +1 per NODE-parameter sub-block)
 *  - scope: PATH of scope ids as number[], e.g. [0], [0,1], [0,2], [0,2,3] ...
 *           (root is [0]; each NODE-parameter group appends a new unique id)
 *  - node:  GLOBAL visit index across the entire flow (1-based, strictly increasing)
 *
 * Notes:
 *  - A NODE-typed parameter opens a new group/lane: depth+1 and scopePath+[newId].
 *  - Functions passed as non-NODE parameters are traversed in the SAME depth/scopePath.
 *  - The `node` id is incremented globally for every visited node and shared by all
 *    RefObjects (inputs from rules and the return value) produced by that node.
 */
export const useRefObjects = (flowId: Flow['id']): Array<ReferenceValue> => {

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore]);
    const nodeContexts = useNodeContext(flowId)

    return flow?.nodes?.nodes?.map(node => {

        const nodeValues = node?.parameters?.nodes?.map(p => p?.value!!) ?? []
        const functionDefinition = functionService.getById(node?.functionDefinition?.id)
        const resolvedReturnType = useReturnType(functionDefinition!, nodeValues as NodeParameterValue[], dataTypeService)
        const nodeContext = nodeContexts?.find(context => context.nodeId === node?.id)

        if (resolvedReturnType) {
            return {
                __typename: "ReferenceValue",
                dataTypeIdentifier: resolvedReturnType,
                nodeFunctionId: node?.id,
                ...(nodeContext ?? {})
            } as ReferenceValue
        }

        return {} as ReferenceValue

    }) ?? []
}

type NodeContext = {
    node: number
    depth: number
    scope: number[]
    nodeId: NodeFunction['id']
}

export const useNodeContext = (
    flowId: Flow['id']
): NodeContext[] => {
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);

    const flowStore = useStore(DFlowReactiveService);
    const functionStore = useStore(DFlowFunctionReactiveService);
    const dataTypeStore = useStore(DFlowDataTypeReactiveService);

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore]);

    return React.useMemo(() => {
        if (!dataTypeService || !flowService || !functionService) return undefined;
        if (!flow?.startingNodeId) return undefined;

        let globalGroupId = 0;
        const nextGroupId = () => ++globalGroupId;

        let globalNodeId = 0;
        const nextNodeId = () => ++globalNodeId;

        const contexts: NodeContext[] = [];

        const traverse = (
            node: NodeFunctionIdWrapper | NodeFunction | undefined,
            depth: number,
            scopePath: number[]
        ) => {
            if (!node) return;

            let current: NodeFunction | undefined =
                node.__typename === "NodeFunctionIdWrapper"
                    ? flowService.getNodeById(flowId, node.id)
                    : (node as NodeFunction);

            while (current) {
                const def = functionService.getById(current.functionDefinition?.id!!);
                if (!def) break;

                const nodeIndex = nextNodeId();
                contexts.push({node: nodeIndex, depth, scope: scopePath, nodeId: current.id});

                if (current.parameters && def.parameterDefinitions) {
                    for (const pDef of def.parameterDefinitions) {
                        const pType = dataTypeService.getDataType(pDef.dataTypeIdentifier!!);
                        const paramInstance = current.parameters?.nodes?.find((p) => p?.id === pDef.id);

                        if (pType?.variant === "NODE") {
                            if (paramInstance?.value && paramInstance.value.__typename === "NodeFunctionIdWrapper") {
                                const childScopePath = [...scopePath, nextGroupId()];
                                traverse(paramInstance.value as NodeFunctionIdWrapper, depth + 1, childScopePath);
                            }
                        } else if (paramInstance?.value && paramInstance.value.__typename === "NodeFunctionIdWrapper") {
                            traverse(paramInstance.value as NodeFunctionIdWrapper, depth, scopePath);
                        }
                    }
                }

                current = flowService.getNodeById(flow.id, current.nextNodeId);
            }
        };

        traverse(flowService.getNodeById(flow.id, flow.startingNodeId), 0, [0]);

        return contexts
    }, [dataTypeService, flow, flowId, flowService, functionService, dataTypeStore, flowStore, functionStore]) ?? [];
};
