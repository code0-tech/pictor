import {useService} from "../../../utils/contextStore";
import {DFlowReactiveSuggestionService} from "./DFlowSuggestion.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {md5} from 'js-md5';
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {isMatchingType, replaceGenericsAndSortType, resolveType} from "../../../utils/generics";
import {NodeFunctionView} from "../DFlow.view";
import {DFlowReactiveService} from "../DFlow.service";
import {useReturnType} from "../function/DFlowFunction.return.hook";
import {useInputType} from "../function/DFlowFunction.input.hook";
import type {
    DataTypeIdentifier,
    DataTypeRulesInputTypeConfig,
    DataTypeRulesItemOfCollectionConfig,
    DataTypeRulesNumberRangeConfig,
    DataTypeRulesVariant,
    DataTypeVariant, Flow,
    Maybe,
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

    const suggestionService = useService(DFlowReactiveSuggestionService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const flowService = useService(DFlowReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const flow = flowService.getById(flowId)
    const dataType = type ? dataTypeService?.getDataType(type) : undefined

    if (!suggestionService || !dataTypeService) return []

    const hashedType = type ? useTypeHash(type) : undefined
    const resolvedType = type ? replaceGenericsAndSortType(resolveType(type, dataTypeService), genericKeys) : undefined
    const state: DFlowSuggestion[] = []
    const cached = suggestionService.getSuggestionsByHash(hashedType || "")

    if (cached.length <= 0) {

        if (hashedType && dataType && suggestionTypes.includes(DFlowSuggestionType.VALUE)) {
            //calculate VALUE
            dataType.rules?.nodes?.forEach(rule => {
                if (rule?.variant === "ITEM_OF_COLLECTION") {
                    (rule.config as DataTypeRulesItemOfCollectionConfig)!!.items?.forEach(value => {
                        const suggestion = new DFlowSuggestion(hashedType, [], {
                            __typename: "LiteralValue",
                            value: value
                        }, DFlowSuggestionType.VALUE, [value.toString()])
                        suggestionService.add(suggestion)
                        state.push(suggestion)
                    })
                } else if (rule?.variant === "NUMBER_RANGE") {
                    const config: DataTypeRulesNumberRangeConfig = rule.config as DataTypeRulesNumberRangeConfig
                    const suggestion = new DFlowSuggestion(hashedType, [], {
                        __typename: "LiteralValue",
                        value: config.from
                    }, DFlowSuggestionType.VALUE, [config.from?.toString() ?? ""])
                    suggestionService.add(suggestion)
                    state.push(suggestion)
                }
            })
        }

        //TODO: need to validate given type
        if (hashedType && dataType && dataType.variant === "DATA_TYPE" && suggestionTypes.includes(DFlowSuggestionType.DATA_TYPE)) {
            dataTypeService.values().forEach(dataType => {
                //TODO: need to wait for sagittarius update to support DataTypes as values
                // @ts-ignore
                const suggestion = new DFlowSuggestion(hashedType, [], dataType.json, DFlowSuggestionType.DATA_TYPE, [dataType.name?.nodes!![0]?.content])
                suggestionService.add(suggestion)
                state.push(suggestion)
            })
        }

        if (suggestionTypes.includes(DFlowSuggestionType.FUNCTION_COMBINATION)) {
            //calculate FUNCTION
            //generics to be replaced with GENERIC todo is written on top
            const matchingFunctions = functionService.values().filter(funcDefinition => {
                if (!type || !resolvedType || !hashedType) return true
                if (funcDefinition.runtimeFunctionDefinition?.identifier == "RETURN" && type) return false
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
                const nodeFunctionSuggestion: NodeParameterValue = {
                    __typename: "NodeFunction",
                    //TODO: generate unique id
                    id: `gid://sagittarius/NodeFunction/${(flow?.nodes?.length ?? 0) + 1}`,
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
                const suggestion = new DFlowSuggestion(hashedType || "", [], nodeFunctionSuggestion, DFlowSuggestionType.FUNCTION, [funcDefinition.names?.nodes!![0]?.content as string])
                state.push(suggestion)
            })
        }

    }

    if (suggestionTypes.includes(DFlowSuggestionType.REF_OBJECT)) {
        //calculate REF_OBJECTS && FUNCTION_COMBINATION
        const refObjects = type ? useRefObjects(flowId) : []

        refObjects.forEach(value => {
            if ((value?.node ?? 0) >= node) return
            if ((value?.depth ?? 0) > depth) return
            if ((value?.scope ?? []).some(r => !scope.includes(r))) return
            if (!resolvedType) return

            const resolvedRefObjectType = replaceGenericsAndSortType(resolveType(value.dataTypeIdentifier!!, dataTypeService), [])
            if (!isMatchingType(resolvedType, resolvedRefObjectType)) return

            const suggestion = new DFlowSuggestion(hashedType || "", [], value as ReferenceValue, DFlowSuggestionType.REF_OBJECT, [`${value.depth}-${value.scope}-${value.node || ''}`])
            state.push(suggestion)
        })
    }

    return [...state, ...suggestionService.getSuggestionsByHash(hashedType || "")].sort()

}

/**
 * React hook that produces a stable MD5 hash for a given Type, deeply resolving:
 * - All type aliases (via DFlowDataTypeReactiveService) at any level of nesting
 * - All occurrences of any provided generic_keys (can be any string) as "GENERIC"
 * - All generic_mapper/type fields, rules/config.type fields, and parent fields, recursively
 * - All object keys sorted for stable, order-independent hashing
 *
 * This ensures semantically equivalent types—regardless of alias, generic key naming, or structural nesting—
 * always produce the same hash, making this suitable for caching, deduplication, and fast comparison.
 *
 * @param type          The Type to hash (either a string or a GenericType object)
 * @param generic_keys  (optional) Array of string keys that should be normalized as generics (can be any string)
 * @returns             MD5 hash string if type/service available, otherwise undefined
 */
export const useTypeHash = (type: DataTypeIdentifier, generic_keys?: string[]): string | undefined => {
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    if (!type || !dataTypeService) return undefined


    // 1. Expand all aliases and deeply unify generics
    const expandedType = resolveType(type, dataTypeService)
    // 2. Replace generics and sort keys for canonicalization
    const canonical = replaceGenericsAndSortType(expandedType, generic_keys)
    // 3. Stable stringification for MD5
    const stableString = JSON.stringify(canonical)

    // 4. MD5 hash
    return md5(stableString)
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
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);

    const refObjects: Array<ReferenceValue> = [];
    if (!dataTypeService || !flowService || !functionService) return refObjects;

    const flow = flowService.values().find((f) => f.id === flowId);
    if (!flow?.startingNodeId) return refObjects;

    // Global, strictly increasing group id used to extend the scope PATH.
    // Root scope path is [0]; first created group gets id 1, then 2, ...
    let globalGroupId = 0;
    const nextGroupId = () => ++globalGroupId;

    // Global, strictly increasing node id across the ENTIRE flow (1-based).
    let globalNodeId = 0;
    const nextNodeId = () => ++globalNodeId;

    /**
     * DFS across a lane: visit node, recurse into NODE-parameter groups, then follow nextNode.
     * `scopePath` is the full scope path (e.g., [0], [0,2], [0,2,4], ...).
     */
    const traverse = (
        fn: NodeFunctionView | undefined,
        depth: number,
        scopePath: number[]
    ) => {
        if (!fn) return;

        let current: NodeFunctionView | undefined = fn;

        while (current) {
            const def = functionService.getById(current.functionDefinition?.id!!);
            if (!def) break;

            // Assign a single GLOBAL node id for this node (shared by all outputs/inputs it yields).
            const node = nextNodeId();

            // 1) INPUT_TYPE rules (variables per input parameter; skip NODE-typed params)
            if (current.parameters && def.parameterDefinitions) {
                for (const pDef of def.parameterDefinitions) {
                    const pType = dataTypeService.getDataType(pDef.dataTypeIdentifier!!);
                    if (!pType || pType.variant === "NODE") continue;

                    const inputTypeRules =
                        pType.rules?.nodes?.filter((r) => r?.variant === "INPUT_TYPES") ?? [];

                    if (inputTypeRules.length) {
                        const paramInstance = current.parameters.find((p) => p.id === pDef.id);
                        const rawValue = paramInstance?.value;
                        const valuesArray =
                            rawValue !== undefined
                                ? rawValue instanceof NodeFunctionView
                                    ? [rawValue.json()!!]
                                    : [rawValue]
                                : [];

                        for (const rule of inputTypeRules) {
                            const cfg = rule?.config as DataTypeRulesInputTypeConfig;
                            const resolved = useInputType(cfg.dataTypeIdentifier!!, def, valuesArray, dataTypeService);
                            if (resolved) {
                                refObjects.push({
                                    __typename: "ReferenceValue",
                                    dataTypeIdentifier: resolved,
                                    depth,
                                    scope: scopePath,
                                    node,
                                });
                            }
                        }
                    }
                }
            }

            // 2) Return type (main output of the current node)
            {
                const paramValues =
                    current.parameters?.map((p) => p.value).filter((v) => v !== undefined) ?? [];
                const resolvedReturnType = useReturnType(
                    def,
                    paramValues.map((v) => (v instanceof NodeFunctionView ? v.json()!! : v)),
                    dataTypeService
                );
                if (resolvedReturnType) {
                    refObjects.push({
                        __typename: "ReferenceValue",
                        dataTypeIdentifier: resolvedReturnType,
                        depth,
                        scope: scopePath,
                        node,
                    });
                }
            }

            // 3) For each NODE-typed parameter: create a NEW group/lane
            if (current.parameters && def.parameterDefinitions) {
                for (const pDef of def.parameterDefinitions) {
                    const pType = dataTypeService.getDataType(pDef.dataTypeIdentifier!!);
                    if (pType?.variant === "NODE") {
                        const paramInstance = current.parameters.find((p) => p.id === pDef.id);
                        if (paramInstance?.value && paramInstance.value instanceof NodeFunctionView) {
                            const childFn = paramInstance.value as NodeFunctionView;

                            // New group: extend the scope path with a fresh id; increase depth by 1.
                            const childScopePath = [...scopePath, nextGroupId()];
                            traverse(childFn, depth + 1, childScopePath);
                        }
                    } else {
                        // Functions passed as NON-NODE parameters: same depth and same scope path.
                        const paramInstance = current.parameters.find((p) => p.id === pDef.id);
                        if (paramInstance?.value && paramInstance.value instanceof NodeFunctionView) {
                            traverse(paramInstance.value as NodeFunctionView, depth, scopePath);
                        }
                    }
                }
            }

            // 4) Continue the linear chain in the same lane/scope.
            current = flow.getNodeById(current.nextNodeId!!);
        }
    };

    // Root lane: depth 0, scope path [0]; node starts at 1 on the first visited node.
    traverse(flow.getNodeById(flow.startingNodeId), 0, [0]);

    return refObjects;
};