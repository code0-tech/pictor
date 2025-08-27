import {useService} from "../../../utils/contextStore";
import {DFlowReactiveSuggestionService} from "./DFlowSuggestion.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {EDataType, RefObject, Type} from "../data-type/DFlowDataType.view";
import {md5} from 'js-md5';
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {DFlowDataTypeItemOfCollectionRuleConfig} from "../data-type/rules/DFlowDataTypeItemOfCollectionRule";
import {DFlowDataTypeNumberRangeRuleConfig} from "../data-type/rules/DFlowDataTypeNumberRangeRule";
import {DFlowFunctionReactiveService} from "../function/DFlowFunction.service";
import {isMatchingType, replaceGenericsAndSortType, resolveType} from "../../../utils/generics";
import {NodeFunction, NodeFunctionObject, NodeParameterObject} from "../DFlow.view";
import {DFlowReactiveService} from "../DFlow.service";
import {useReturnType} from "../function/DFlowFunction.return.hook";
import {DFlowDataTypeInputTypeRuleConfig} from "../data-type/rules/DFlowDataTypeInputTypeRule";
import {useInputType} from "../function/DFlowFunction.input.hook";
import {EDataTypeRuleType} from "../data-type/rules/DFlowDataTypeRules";

//TODO: instead of GENERIC use some uuid or hash for replacement
//TODO: deep type search
//TODO: calculate FUNCTION_COMBINATION deepness max 2
//TODO: No type => just all function suggestion and also maybe combinations

export const useSuggestions = (type: Type | undefined, genericKeys: string[] | undefined, flowId: string, depthLevel: number = 0, scopeLevel: number = 0, nodeLevel: number = 1): DFlowSuggestion[] => {

    const suggestionService = useService(DFlowReactiveSuggestionService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)

    const dataType = type ? dataTypeService?.getDataType(type) : undefined

    if (!suggestionService || !dataTypeService) return []

    const hashedType = type ? useTypeHash(type) : undefined
    const resolvedType = type ? replaceGenericsAndSortType(resolveType(type, dataTypeService), genericKeys) : undefined
    const state: DFlowSuggestion[] = []
    const cached = suggestionService.getSuggestionsByHash(hashedType || "")

    if (cached.length <= 0) {

        if (hashedType && dataType) {
            //calculate VALUE
            dataType.rules?.forEach(rule => {
                if (rule.type === EDataTypeRuleType.ITEM_OF_COLLECTION) {
                    (rule.config as DFlowDataTypeItemOfCollectionRuleConfig).items.forEach(value => {
                        const suggestion = new DFlowSuggestion(hashedType, [], value, DFlowSuggestionType.VALUE, [value.toString()])
                        suggestionService.addSuggestion(suggestion)
                        state.push(suggestion)
                    })
                } else if (rule.type === EDataTypeRuleType.NUMBER_RANGE) {
                    const config: DFlowDataTypeNumberRangeRuleConfig = rule.config as DFlowDataTypeNumberRangeRuleConfig
                    const suggestion = new DFlowSuggestion(hashedType, [], config.from, DFlowSuggestionType.VALUE, [config.from.toString()])
                    suggestionService.addSuggestion(suggestion)
                    state.push(suggestion)
                }
            })
        }


        //calculate FUNCTION
        //generics to be replaced with GENERIC todo is written on top
        const matchingFunctions = functionService.values().filter(funcDefinition => {
            if (!type || !resolvedType || !hashedType) return true
            if (!funcDefinition.return_type) return false
            const resolvedReturnType = replaceGenericsAndSortType(resolveType(funcDefinition.return_type, dataTypeService), funcDefinition.genericKeys)
            return isMatchingType(resolvedType, resolvedReturnType)

        })

        matchingFunctions.forEach(funcDefinition => {
            const suggestion = new DFlowSuggestion(hashedType || "", [], {
                function: {
                    function_id: funcDefinition.function_id,
                    runtime_function_id: funcDefinition.runtime_function_id
                },
                parameters: funcDefinition.parameters?.map(paramDefinition => {
                    return {
                        definition: {
                            parameter_id: paramDefinition.parameter_id,
                            runtime_parameter_id: paramDefinition.runtime_function_id
                        }
                    } as NodeParameterObject
                })
            } as NodeFunctionObject, DFlowSuggestionType.FUNCTION, [funcDefinition.function_id])
            suggestionService.addSuggestion(suggestion)
            state.push(suggestion)
        })

    }


    //calculate REF_OBJECTS && FUNCTION_COMBINATION
    const refObjects = type ? useRefObjects(flowId) : []
    // Build scope intervals from the collected refObjects
    const scopeStart: Record<number, number> = {};
    const scopeEnd:   Record<number, number> = {};
    for (const v of refObjects) {
        if (scopeStart[v.scope] === undefined || v.nodeLevel < scopeStart[v.scope]) {
            scopeStart[v.scope] = v.nodeLevel;
        }
        if (scopeEnd[v.scope] === undefined || v.nodeLevel > scopeEnd[v.scope]) {
            scopeEnd[v.scope] = v.nodeLevel;
        }
    }
    refObjects.forEach(value => {
        if (value.nodeLevel >= nodeLevel) {
            // liegt nicht "über" der Ziel-Node  -> verwerfen
            return;
        }

        if (value.depth > depthLevel) {
            // kommt aus tieferem (Kind-)Block    -> verwerfen
            return;
        }

        const sameScope     = value.scope === scopeLevel;
        const ancestorScope = scopeStart[value.scope] <= nodeLevel && nodeLevel <= scopeEnd[value.scope];

        if (!sameScope && !ancestorScope) {
            // anderer, nicht-vorfahrlicher Block -> verwerfen
            return;
        }
        const suggestion = new DFlowSuggestion(hashedType || "", [], value as RefObject, DFlowSuggestionType.REF_OBJECT, [`${value.depth}-${value.scope}-${value.nodeLevel || ''}`, JSON.stringify(value.type)])
        state.push(suggestion)
    })


    return [...state, ...suggestionService.getSuggestionsByHash(hashedType || "")]

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
export const useTypeHash = (type: Type, generic_keys?: string[]): string | undefined => {
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
 * all in-scope RefObjects (variables/outputs) with contextual metadata:
 *  - depth: structural nesting (root 0; +1 per NODE-parameter group)
 *  - scope: unique scope ID per group/lane (root 0; every group gets a new global ID)
 *  - nodeLevel: GLOBAL visit index across the entire flow (1-based, strictly increasing)
 *
 * Notes:
 *  - A NODE-typed parameter opens a new group/lane: depth+1 and a new unique scope ID.
 *  - Functions passed as non-NODE parameters are traversed in the SAME depth/scope.
 *  - The nodeLevel is incremented globally for every visited node and is shared by all
 *    RefObjects (input variables from rules and the return value) produced by that node.
 */
export const useRefObjects = (flowId: string): Array<RefObject> => {
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);

    const refObjects: Array<RefObject> = [];
    if (!dataTypeService || !flowService || !functionService) return refObjects;

    const flow = flowService.values().find((f) => f.id === flowId);
    if (!flow?.startingNode) return refObjects;

    // Global, strictly increasing scope ID for groups (root = 0; every new group: ++).
    let globalScopeCounter = 0;
    const nextGlobalScope = () => ++globalScopeCounter;

    // Global, strictly increasing node-level counter across the ENTIRE flow (1-based).
    let globalNodeLevel = 0;
    const nextGlobalNodeLevel = () => ++globalNodeLevel + globalScopeCounter;

    /**
     * DFS across a lane: visit node, recurse into NODE-parameter groups, then follow nextNode.
     */
    const traverse = (fn: NodeFunction | undefined, depth: number, scope: number) => {
        if (!fn) return;

        let current: NodeFunction | undefined = fn;

        while (current) {
            const def = functionService.getFunctionDefinition(current.id);
            if (!def) break;

            // Assign a single GLOBAL nodeLevel for this node (shared by all outputs/inputs it yields).
            const nodeLevel = nextGlobalNodeLevel();

            // 1) INPUT_TYPE rules (variables per input parameter; skip NODE-typed params)
            if (current.parameters && def.parameters) {
                for (const pDef of def.parameters) {
                    const pType = dataTypeService.getDataType(pDef.type);
                    if (!pType || pType.type === EDataType.NODE) continue;

                    const inputTypeRules =
                        pType.rules?.filter((r) => r.type === EDataTypeRuleType.INPUT_TYPE) ?? [];

                    if (inputTypeRules.length) {
                        const paramInstance = current.parameters.find((p) => p.id === pDef.parameter_id);
                        const rawValue = paramInstance?.value;
                        const valuesArray =
                            rawValue !== undefined
                                ? rawValue instanceof NodeFunction
                                    ? [rawValue.json]
                                    : [rawValue]
                                : [];

                        for (const rule of inputTypeRules) {
                            const cfg = rule.config as DFlowDataTypeInputTypeRuleConfig;
                            const resolved = useInputType(cfg.type, def, valuesArray, dataTypeService);
                            if (resolved) {
                                refObjects.push({
                                    type: resolved,
                                    depth,
                                    scope,
                                    nodeLevel,
                                    tertiaryLevel: cfg.key,
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
                    paramValues.map((v) => (v instanceof NodeFunction ? v.json : v)),
                    dataTypeService
                );
                if (resolvedReturnType) {
                    refObjects.push({
                        type: resolvedReturnType,
                        depth,
                        scope,
                        nodeLevel,
                    });
                }
            }

            // 3) For each NODE-typed parameter: create a NEW group/lane (depth+1, new scope)
            if (current.parameters && def.parameters) {
                for (const pDef of def.parameters) {
                    const pType = dataTypeService.getDataType(pDef.type);
                    if (pType?.type === EDataType.NODE) {
                        const paramInstance = current.parameters.find((p) => p.id === pDef.parameter_id);
                        if (paramInstance?.value && paramInstance.value instanceof NodeFunction) {
                            const childFn = paramInstance.value as NodeFunction;

                            // New group/lane -> unique scope ID; child lives at depth+1 in that scope.
                            const childScope = nextGlobalScope();
                            traverse(childFn, depth + 1, childScope);
                        }
                    } else {
                        // Functions passed as NON-NODE parameters remain in the SAME depth/scope.
                        const paramInstance = current.parameters.find((p) => p.id === pDef.parameter_id);
                        if (paramInstance?.value && paramInstance.value instanceof NodeFunction) {
                            traverse(paramInstance.value as NodeFunction, depth, scope);
                        }
                    }
                }
            }

            // 4) Continue the linear chain in the same lane/scope.
            current = current.nextNode;
        }
    };

    // Root lane: depth 0, scope 0; nodeLevel starts at 1 on the first visited node.
    traverse(flow.startingNode, 0, 0);

    return refObjects;
}