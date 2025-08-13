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
import {NodeFunction, NodeFunctionObject} from "../DFlow.view";
import {DFlowReactiveService} from "../DFlow.service";
import {useReturnType} from "../function/DFlowFunction.return.hook";
import {DFlowDataTypeInputTypeRuleConfig} from "../data-type/rules/DFlowDataTypeInputTypeRule";
import {useInputType} from "../function/DFlowFunction.input.hook";
import {EDataTypeRuleType} from "../data-type/rules/DFlowDataTypeRules";

//TODO: instead of GENERIC use some uuid or hash for replacement
//TODO: deep type search
//TODO: calculate FUNCTION_COMBINATION deepness max 2
//TODO: No type => just all function suggestion and also maybe combinations

export const useSuggestions = (type: Type, genericKeys: string[], flowId: string, contextLevel: number = 0, nodeLevel: number = 1): DFlowSuggestion[] => {

    const suggestionService = useService(DFlowReactiveSuggestionService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)

    const dataType = dataTypeService?.getDataType(type)

    if (!dataType || !suggestionService || !dataTypeService) return []

    const hashedType = useTypeHash(type)
    const resolvedType = replaceGenericsAndSortType(resolveType(type, dataTypeService), genericKeys)
    const state: DFlowSuggestion[] = []
    if (!hashedType) return []
    const cached = suggestionService.getSuggestionsByHash(hashedType || "")

    if (cached.length <= 0) {

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

        //calculate FUNCTION
        //generics to be replaced with GENERIC todo is written on top
        const matchingFunctions = functionService.values().filter(funcDefinition => {
            if (!funcDefinition.return_type) return false
            const resolvedReturnType = replaceGenericsAndSortType(resolveType(funcDefinition.return_type, dataTypeService), funcDefinition.genericKeys)
            return isMatchingType(resolvedType, resolvedReturnType)

        })

        matchingFunctions.forEach(funcDefinition => {
            const suggestion = new DFlowSuggestion(hashedType, [], {
                function: {
                    function_id: funcDefinition.function_id,
                    runtime_function_id: funcDefinition.runtime_function_id
                },
            } as NodeFunctionObject, DFlowSuggestionType.FUNCTION, [funcDefinition.function_id])
            suggestionService.addSuggestion(suggestion)
            state.push(suggestion)
        })

    }


    //calculate REF_OBJECTS && FUNCTION_COMBINATION
    const refObjects = useRefObjects(flowId)
    refObjects.forEach(value => {
        if (value.primaryLevel > contextLevel && value.secondaryLevel > nodeLevel) return
        const suggestion = new DFlowSuggestion(hashedType, [], value as RefObject, DFlowSuggestionType.REF_OBJECT, [`${value.primaryLevel}-${value.secondaryLevel}-${value.tertiaryLevel || ''}`, JSON.stringify(value.type)])
        state.push(suggestion)
    })


    return [...state, ...suggestionService.getSuggestionsByHash(hashedType)]

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
 * Traverses a flow (starting from its startingNode as NodeFunction) and collects all RefObjects ("variables") that are in scope.
 * - Each context (primaryLevel) starts at 0 for the main flow.
 * - Every parameter of a NodeFunction with DataType NODE creates a *new* context (new primaryLevel, incrementing globally).
 * - secondaryLevel is the position of the Node within its vertical context (starts at 1, increments down the block).
 * - Each context number (primaryLevel) is unique, incrementing depth-first, left-to-right through parameters/subNodes.
 * - Handles recursive/branching contexts via NodeFunctionParameter.subNode.
 *
 * @param flowId The ID of the flow to traverse.
 * @returns Array of RefObject (all collected variables/outputs with contextual levels)
 */
export const useRefObjects = (flowId: string): Array<RefObject> => {
    const dataTypeService = useService(DFlowDataTypeReactiveService);
    const flowService = useService(DFlowReactiveService);
    const functionService = useService(DFlowFunctionReactiveService);

    const refObjects: Array<RefObject> = [];
    if (!dataTypeService || !flowService || !functionService) return refObjects;

    const flow = flowService.values().find(f => f.id === flowId);
    if (!flow?.startingNode) return refObjects;

    let contextCounter = 0; // Global context counter for primaryLevel

    /**
     * Recursively traverses a vertical block (nextNode chain) and collects RefObjects,
     * entering new contexts on each NODE-typed parameter via NodeFunctionParameter.subNode.
     * @param node The starting NodeFunction of this context/block
     * @param primaryLevel The context number (scope/block)
     */
    function traverseBlock(node: NodeFunction | undefined, primaryLevel: number) {
        let currentNode = node;
        let secondaryLevel = 1; // Node position within the context

        while (currentNode) {
            const functionDefinition = functionService.getFunctionDefinition(currentNode.id);
            if (!functionDefinition) break;

            // Handle NODE-typed parameters (start new context for each subNode)
            if (currentNode.parameters && functionDefinition.parameters) {
                for (const paramDef of functionDefinition.parameters) {
                    const paramType = dataTypeService.getDataType(paramDef.type);
                    if (paramType && paramType.type === EDataType.NODE) {
                        // Finde passendes Parameter-Objekt
                        const paramInstance = currentNode.parameters.find(p => p.id === paramDef.parameter_id);
                        if (paramInstance?.value) {
                            contextCounter++; // neuer Kontext
                            traverseBlock(paramInstance.value as NodeFunction, contextCounter);
                        }
                    }
                }
            }

            // Handle INPUT_TYPE rules (RefObject for each input-type parameter)
            if (currentNode.parameters && functionDefinition.parameters) {
                for (const paramDef of functionDefinition.parameters) {
                    const paramType = dataTypeService.getDataType(paramDef.type);
                    if (!paramType || paramType.type === EDataType.NODE) continue;
                    const inputTypeRules = paramType.rules?.filter(
                        rule => rule.type === EDataTypeRuleType.INPUT_TYPE
                    ) || [];
                    for (const rule of inputTypeRules) {
                        const config = rule.config as DFlowDataTypeInputTypeRuleConfig;
                        const paramInstance = currentNode.parameters.find(p => p.id === paramDef.parameter_id);
                        const paramValue = paramInstance?.value;
                        const resolvedInputType = useInputType(
                            config.type,
                            functionDefinition,
                            paramValue !== undefined ? paramValue instanceof NodeFunction ? [paramValue.json] : [paramValue] : [],
                            dataTypeService
                        );
                        if (resolvedInputType) {
                            refObjects.push({
                                type: resolvedInputType,
                                primaryLevel,
                                secondaryLevel,
                                tertiaryLevel: config.key
                            });
                        }
                    }
                }
            }

            // Handle return type (main output of this node)
            const paramValues = currentNode.parameters?.map(p => p.value).filter(v => v !== undefined) || [];
            const resolvedReturnType = useReturnType(functionDefinition, paramValues.map(paramValue => paramValue instanceof NodeFunction ? paramValue.json : paramValue), dataTypeService);
            if (resolvedReturnType) {
                refObjects.push({
                    type: resolvedReturnType,
                    primaryLevel,
                    secondaryLevel
                });
            }

            currentNode = currentNode.nextNode;
            secondaryLevel++;
        }
    }

    // Start main context (0)
    traverseBlock(flow.startingNode, 0);

    return refObjects;
};