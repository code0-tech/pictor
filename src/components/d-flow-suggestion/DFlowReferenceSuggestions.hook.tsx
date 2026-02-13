import React from "react";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {
    isMatchingType,
    replaceGenericKeysInType,
    replaceGenericsAndSortType,
    resolveGenericKeys,
    resolveType,
    targetForGenericKey
} from "../../utils/generics";
import {
    DataType,
    DataTypeIdentifier,
    DataTypeRulesContainsKeyConfig,
    DataTypeRulesInputTypesConfig,
    Flow,
    Maybe,
    NodeFunction,
    NodeFunctionIdWrapper,
    NodeParameterValue,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowReactiveService} from "../d-flow";
import {useReturnTypes} from "../d-flow-node/DFlowNode.return.hook";

interface ExtendedReferenceValue extends ReferenceValue {
    parameterIndex?: number
    inputTypeIndex?: number
    inputTypeIdentifier?: string
    node: number
    depth: number
    scope: number[]
}

export const useReferenceSuggestions = (
    flowId: Flow['id'],
    nodeId?: NodeFunction['id'],
    dataTypeIdentifier?: DataTypeIdentifier,
    genericKeys: string[] = []
): DFlowSuggestion[] => {
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    const nodeContexts = useNodeContext(flowId)
    const nodeContext = React.useMemo(() => (
        nodeId ? nodeContexts?.find(context => context.nodeFunctionId === nodeId) : undefined
    ), [nodeContexts, nodeId])
    const nodeParameters = React.useMemo(() => {
        if (!nodeId) return []
        const node = flowService.getNodeById(flowId, nodeId)
        return node?.parameters?.nodes?.map(p => p?.value).filter((value): value is NodeFunctionIdWrapper => value?.__typename === "NodeFunctionIdWrapper") ?? []
    }, [flowId, nodeId, flowService, flowStore])

    const resolvedType = React.useMemo(() => (
        dataTypeIdentifier ? replaceGenericsAndSortType(resolveType(dataTypeIdentifier, dataTypeService), genericKeys) : undefined
    ), [dataTypeIdentifier, dataTypeService, dataTypeStore, genericKeys])

    const refObjects = useRefObjects(flowId)
    const returnTypes = useReturnTypes(flowId)

    return React.useMemo(() => {
        if (!resolvedType || !nodeContext) return []

        const {depth, scope, node} = nodeContext
        return refObjects.flatMap(value => {
            if (value.node === null || value.node === undefined) return []
            if (value.depth === null || value.depth === undefined) return []
            if (value.scope === null || value.scope === undefined) return []

            const isInputTypeRef = value.parameterIndex !== undefined && value.inputTypeIndex !== undefined
            const isInputTypeScopeMatch = isInputTypeRef
                ? value.scope?.every((scopeId, index) => scope?.[index] === scopeId)
                : true
            if (isInputTypeRef && !isInputTypeScopeMatch) return []
            if (nodeParameters.some(param => param.id === value.nodeFunctionId)) return []
            if (!isInputTypeRef && value.node >= node!) return []
            if (value.depth > depth!) return []
            if (value.scope.some(r => !scope!.includes(r))) return []

            const returnTypeIdentifier = returnTypes.get(value.nodeFunctionId)
            const resolvedRefObjectType = replaceGenericsAndSortType(resolveType(returnTypeIdentifier!, dataTypeService), [])
            if (!isMatchingType(resolvedType, resolvedRefObjectType)) return []

            return [{
                path: [],
                type: DFlowSuggestionType.REF_OBJECT,
                displayText: [`${value.depth}-${value.scope}-${value.node || ''}-${value.referencePath?.map(path => path.path).join(".") ?? ""}`],
                value: value as ReferenceValue,
            }]
        })
    }, [dataTypeService, nodeContext, nodeParameters, refObjects, resolvedType, returnTypes])
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
const useRefObjects = (flowId: Flow['id']): Array<ExtendedReferenceValue> => {

    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    const flow = React.useMemo(() => flowService.getById(flowId), [flowId, flowStore]);
    const nodeContexts = useNodeContext(flowId)

    const returnTypes = useReturnTypes(flowId)

    const nodeSuggestions = React.useMemo(() => {
        return flow?.nodes?.nodes?.map(node => {

            const resolvedReturnType = returnTypes.get(node?.id)
            const nodeContext = nodeContexts?.find(context => context.nodeFunctionId === node?.id)

            if (resolvedReturnType && nodeContext) {
                return referenceExtraction(nodeContext, resolvedReturnType, dataTypeService)
            }

            return {} as ExtendedReferenceValue

        }) ?? []
    }, [flow])

    const flowInputSuggestions = React.useMemo(() => {
        return referenceExtraction({
            node: 0,
            depth: 0,
            nodeFunctionId: "gid://sagittarius/NodeFunction/-1",
            scope: [0]
        }, {
            dataType: flow?.inputType
        })
    }, [flow])

    const inputSuggestions: ExtendedReferenceValue[] = React.useMemo(() => {
        if (!flow?.nodes?.nodes?.length) return []

        return flow.nodes.nodes.flatMap((node) => {
            const functionDefinition = functionService.getById(node?.functionDefinition?.id)
            if (!functionDefinition) return []
            const nodeValues =
                node?.parameters?.nodes?.map((p) => p?.value!).filter(Boolean) ?? []

            return (functionDefinition.parameterDefinitions ?? []).flatMap((paramDef, index) => {
                const dataTypeIdentifier = paramDef?.dataTypeIdentifier
                if (!dataTypeIdentifier) return []

                const pType = dataTypeService.getDataType(dataTypeIdentifier)
                if (!pType || pType.variant !== "NODE") return []


                const paramInstance = node?.parameters?.nodes?.find((p) => p?.parameterDefinition?.id === paramDef?.id)
                if (!paramInstance?.value || paramInstance.value.__typename !== "NodeFunctionIdWrapper") return []

                const paramNodeContext = nodeContexts?.find(
                    (context) => paramInstance?.value?.__typename === "NodeFunctionIdWrapper" && context.nodeFunctionId === paramInstance.value?.id
                )

                if (!paramNodeContext) return []

                const inputTypeRules =
                    pType.rules?.nodes?.filter((r) => r?.variant === "INPUT_TYPES") ?? []

                const genericTypeMap = resolveGenericKeys(functionDefinition, nodeValues, dataTypeService, functionService)
                const genericTargetMap = targetForGenericKey(functionDefinition, dataTypeIdentifier)
                const resolvedGenericMap = new Map(
                    [...genericTypeMap].map(([key, value]) => [genericTargetMap.get(key) ?? key, value])
                )

                return inputTypeRules.flatMap((rule) => {
                    const config = rule?.config as DataTypeRulesInputTypesConfig | undefined
                    const inputTypes = config?.inputTypes ?? []

                    return inputTypes.flatMap((inputType, inputIndex) => {
                        const resolved = replaceGenericKeysInType(
                            inputType.dataTypeIdentifier!,
                            resolvedGenericMap
                        )
                        if (!resolved) return []

                        return referenceExtraction({
                            ...paramNodeContext,
                            nodeFunctionId: node?.id!,
                            parameterIndex: index,
                            inputTypeIndex: inputIndex,
                            inputTypeIdentifier: inputType.inputIdentifier!
                        }, resolved, dataTypeService)
                    })
                })
            })
        })
    }, [flow, nodeContexts, functionService, dataTypeService])

    return [
        ...inputSuggestions,
        ...flowInputSuggestions,
        ...nodeSuggestions
    ].flat()
}

const referenceExtraction = (nodeContext: ExtendedReferenceValue, dataTypeIdentifier: DataTypeIdentifier, dataTypeService?: DFlowDataTypeReactiveService): ExtendedReferenceValue[] => {

    const dataType: Maybe<DataType> | undefined = dataTypeService ? dataTypeService.getDataType(dataTypeIdentifier) : dataTypeIdentifier.dataType ?? dataTypeIdentifier.genericType?.dataType
    if (!dataType) return []

    const references = dataType.rules?.nodes?.map(rule => {
        if (rule?.variant === "CONTAINS_KEY") {
            if (!dataTypeIdentifier) return
            return referenceExtraction({
                ...nodeContext,
                referencePath: [
                    ...(nodeContext.referencePath ?? []),
                    {
                        path: (rule.config as DataTypeRulesContainsKeyConfig).key!!
                    }
                ]
            }, (rule.config as DataTypeRulesContainsKeyConfig).dataTypeIdentifier!!)
        }

        return undefined

    }).flat().filter(ref => !!ref) ?? []

    return [
        ...references,
        {
            __typename: "ReferenceValue",
            nodeFunctionId: nodeContext.nodeFunctionId,
            ...nodeContext
        }]

}

const useNodeContext = (
    flowId: Flow['id']
): ExtendedReferenceValue[] => {
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

        const contexts: ExtendedReferenceValue[] = [];

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

                if (current.parameters && def.parameterDefinitions) {
                    for (const pDef of def.parameterDefinitions) {
                        const pType = dataTypeService.getDataType(pDef.dataTypeIdentifier!!);
                        const paramInstance = current.parameters?.nodes?.find((p) => p?.parameterDefinition?.id === pDef.id);

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

                const nodeIndex = nextNodeId();
                contexts.push({node: nodeIndex, depth, scope: scopePath, nodeFunctionId: current.id});

                current = flowService.getNodeById(flow.id, current.nextNodeId);
            }
        };


        traverse(flowService.getNodeById(flow.id, flow.startingNodeId), 0, [0]);

        return contexts
    }, [dataTypeService, flow, flowId, flowService, functionService, dataTypeStore, flowStore, functionStore]) ?? [];
};
