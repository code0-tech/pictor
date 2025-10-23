import {useService} from "../../../utils/contextStore";
import {DFlowReactiveSuggestionService} from "./DFlowSuggestion.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {EDataType, GenericType, RefObject, Type} from "../data-type/DFlowDataType.view";
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

export const useSuggestions = (
    type: Type | undefined,
    genericKeys: string[] | undefined,
    flowId: string,
    depth: number = 0,
    scope: number[] = [0],
    node: number = 1): DFlowSuggestion[] => {

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
            if (funcDefinition.runtime_function_id == "RETURN" && type) return false
            if (dataType?.type === EDataType.NODE) return true
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

    refObjects.forEach(value => {
        if (value.node >= node) return
        if (value.depth > depth) return
        if (value.scope.some(r => !scope.includes(r))) return
        if (!resolvedType) return

        const resolvedRefObjectType = replaceGenericsAndSortType(resolveType(value.type, dataTypeService), [])
        if (!isMatchingType(resolvedType, resolvedRefObjectType)) return

        const suggestion = new DFlowSuggestion(hashedType || "", [], value as RefObject, DFlowSuggestionType.REF_OBJECT, [`${value.depth}-${value.scope}-${value.node || ''}`, JSON.stringify(value.type)])
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
export const useRefObjects = (flowId: string): Array<RefObject> => {
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);

    const refObjects: Array<RefObject> = [];
    if (!dataTypeService || !flowService || !functionService) return refObjects;

    const flow = flowService.values().find((f) => f.id === flowId);
    if (!flow?.startingNode) return refObjects;

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
        fn: NodeFunction | undefined,
        depth: number,
        scopePath: number[]
    ) => {
        if (!fn) return;

        let current: NodeFunction | undefined = fn;

        while (current) {
            const def = functionService.getFunctionDefinition(current.id);
            if (!def) break;

            // Assign a single GLOBAL node id for this node (shared by all outputs/inputs it yields).
            const node = nextNodeId();

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
                    paramValues.map((v) => (v instanceof NodeFunction ? v.json : v)),
                    dataTypeService
                );
                if (resolvedReturnType) {
                    refObjects.push({
                        type: resolvedReturnType,
                        depth,
                        scope: scopePath,
                        node,
                    });
                }
            }

            // 3) For each NODE-typed parameter: create a NEW group/lane
            if (current.parameters && def.parameters) {
                for (const pDef of def.parameters) {
                    const pType = dataTypeService.getDataType(pDef.type);
                    if (pType?.type === EDataType.NODE) {
                        const paramInstance = current.parameters.find((p) => p.id === pDef.parameter_id);
                        if (paramInstance?.value && paramInstance.value instanceof NodeFunction) {
                            const childFn = paramInstance.value as NodeFunction;

                            // New group: extend the scope path with a fresh id; increase depth by 1.
                            const childScopePath = [...scopePath, nextGroupId()];
                            traverse(childFn, depth + 1, childScopePath);
                        }
                    } else {
                        // Functions passed as NON-NODE parameters: same depth and same scope path.
                        const paramInstance = current.parameters.find((p) => p.id === pDef.parameter_id);
                        if (paramInstance?.value && paramInstance.value instanceof NodeFunction) {
                            traverse(paramInstance.value as NodeFunction, depth, scopePath);
                        }
                    }
                }
            }

            // 4) Continue the linear chain in the same lane/scope.
            current = current.nextNode;
        }
    };

    // Root lane: depth 0, scope path [0]; node starts at 1 on the first visited node.
    traverse(flow.startingNode, 0, [0]);

    return refObjects;
};