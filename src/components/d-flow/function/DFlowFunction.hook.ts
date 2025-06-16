import {FunctionDefinition} from "./DFlowFunction.view";
import {
    DataTypeObject,
    EDataTypeRuleType,
    GenericCombinationStrategy,
    GenericMapper,
    GenericType,
    Type,
    Value
} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {InspectionSeverity, ValidationResult} from "../../../utils/inspection";

export const useFunctionValidation = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): ValidationResult[] | null => {

    const genericMap = new Map<string, Type>()

    const parameterValidation = func.parameters?.every((parameter, index) => {

        const typeFromValue = dataTypeService.getTypeFromValue(values[index])
        const dataTypeFromValue = dataTypeService.getDataType(typeFromValue)
        const typeFromParameter = parameter.type
        const dataTypeFromParameter = dataTypeService.getDataType(typeFromParameter)

        //check if parameter is generic or non-generic
        if (func.genericKeys?.includes(String(parameter.type))
            || (typeof parameter.type == "object"
                && "type" in (parameter.type as GenericType)
                && dataTypeService.getDataType(parameter.type))) {

            //check linked value if generic or non-generic
            //if: parameter and value is generic
            //else if: parameter is generic but value not
            if (typeof typeFromValue == "object"
                && "type" in (typeFromValue as GenericType)
                && dataTypeService.getDataType(parameter.type)) {

                const genericTypes = resolveGenericKeyMappings(typeFromParameter, typeFromValue, func.genericKeys!!)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                const replacedGenericMapper = replaceGenericKeysInType(parameter.type, genericMap) as GenericType
                return dataTypeService.getDataType(parameter.type)?.validateValue(values[index], replacedGenericMapper.generic_mapper)

            } else if (func.genericKeys?.includes(String(parameter.type))) {

                const genericTypes = resolveGenericKeyMappings(typeFromParameter, typeFromValue, func.genericKeys!!)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                const replacedGenericMapper = replaceGenericKeysInType(parameter.type, genericMap) as Type
                return dataTypeService.getDataType(replacedGenericMapper)?.validateValue(values[index])

            } else if (dataTypeService.getDataType(typeFromValue)) {

                const foundMatchingRule = dataTypeFromParameter?.allRules.find(parameterRule => {

                    for (const valueRule of dataTypeFromValue?.allRules!!) {
                        if (parameterRule.type == valueRule.type) {
                            switch (parameterRule.type) {
                                case EDataTypeRuleType.RETURNS_TYPE:
                                    return true
                                case EDataTypeRuleType.INPUT_TYPES:
                                    return true
                                case EDataTypeRuleType.CONTAINS_KEY:
                                    return true
                                case EDataTypeRuleType.CONTAINS_TYPE:
                                    return true
                            }
                        }
                    }
                    return false
                })

                return true
            }

        } else if (dataTypeService.getDataType(parameter.type)) {

            //check linked value if generic or non-generic
            if (typeof typeFromValue == "object"
                && "type" in (typeFromValue as GenericType)
                && dataTypeService.getDataType(parameter.type)) {

                //parameter is non-generic but value is
                return true

            } else if (dataTypeService.getDataType(typeFromValue)) {

                //parameter and value are non-generic
                return true

            }

        }

        return false
    })

    console.log(genericMap, parameterValidation)

    return parameterValidation ? null : [{
        type: InspectionSeverity.ERROR,
        message: [{
            code: "de_DE",
            text: "Not working"
        }]
    }]

}

/**
 * Resolves concrete type mappings for generic keys in a generic type system.
 *
 * This function takes a parameter type (possibly containing generic keys and nested generic mappers)
 * and a value type (the actual, concrete structure) and traverses both in parallel.
 * For every generic key from the `genericKeys` array, it finds the concrete type
 * that is present at the matching position in the value type.
 *
 * The implementation supports:
 * - Simple and nested generics
 * - Generic combination strategies such as AND/OR for multi-key mappings
 * - Arbitrarily deep structures
 *
 * @param parameterType  The template type, which may use generics like "D", "E", etc.
 * @param valueType      The instantiated/concrete type, e.g. "NUMBER", "ARRAY", or objects with their own mappers
 * @param genericKeys    Array of all generic keys to resolve (from function definition)
 * @returns              A mapping from each generic key to its resolved concrete type in valueType
 *
 */
const resolveGenericKeyMappings = (
    parameterType: Type,
    valueType: Type,
    genericKeys: string[]
): Record<string, Type> => {
    const result: Record<string, Type> = {}

    /**
     * Recursively matches parameter type and value type, mapping generics to their concrete types
     *
     * @param param  Current node in the parameter type (string or type object)
     * @param value  Current node in the value type (string or type object)
     */
    function recurse(param: Type, value: Type) {
        // If param is a string and a generic key, map it directly to value
        if (typeof param === "string") {
            if (genericKeys.includes(param)) {
                result[param] = value
            }
            return
        }
        // If value is a string but param is a type object, nothing to do
        if (typeof value === "string") return

        // Only access .generic_mapper if value is an object
        const paramGMs = param.generic_mapper ?? []
        const valueGMs = typeof value === "object" && value !== null ? value.generic_mapper ?? [] : []

        for (const paramGM of paramGMs) {
            // Match generic_target between parameter and value
            const matchingValueGM = valueGMs.find((vgm) => {
                return vgm.generic_target === paramGM.generic_target
            })

            if (!matchingValueGM) continue

            const targetValueTypes = matchingValueGM.types

            // Collect generic keys in this mapping level
            const keysInTypes = paramGM.types.filter((t): t is string => {
                return typeof t === "string" && genericKeys.includes(t)
            })

            const combination = paramGM.generic_combination ?? []

            // If AND/OR with one value type, assign all keys to that type
            if (
                (combination.includes(GenericCombinationStrategy.AND) ||
                    combination.includes(GenericCombinationStrategy.OR)) &&
                targetValueTypes.length === 1 &&
                keysInTypes.length === paramGM.types.length
            ) {
                for (const key of keysInTypes) {
                    result[key] = targetValueTypes[0]
                }
            } else {
                // Otherwise, recurse element-wise (supports mixed keys and nested objects)
                for (let i = 0; i < paramGM.types.length; i++) {
                    const paramSubType = paramGM.types[i]
                    const valueSubType = targetValueTypes[i]
                    recurse(paramSubType, valueSubType)
                }
            }
        }
    }

    recurse(parameterType, valueType)
    return result
}

/**
 * Replaces all generic keys in a parameter type with their resolved concrete types.
 *
 * @param type         The parameter type (could be string or type object)
 * @param genericMap   Map from generic key (e.g. "D") to resolved concrete type (as Map)
 * @returns            New type with generics replaced by their concrete types
 */
const replaceGenericKeysInType = (
    type: Type,
    genericMap: Map<string, Type>
): Type => {
    // If type is a string and is present in the map, replace with the mapped type
    if (typeof type === "string" && genericMap.has(type)) {
        return <GenericType | string>genericMap.get(type)
    }
    // If type is a string but not in the map, return as is
    if (typeof type === "string") {
        return type
    }

    // Recursively replace in all generic_mapper entries
    const newGenericMapper = (type.generic_mapper ?? []).map(gm => ({
        ...gm,
        types: gm.types.map(t => replaceGenericKeysInType(t, genericMap))
    }))

    return {
        ...type,
        generic_mapper: newGenericMapper
    }
}

/**
 * Resolves all occurrences of specified generic keys within a DataTypeObject structure,
 * comparing a generic (template) DataTypeObject with a concrete (instantiated) DataTypeObject.
 * Returns either the concrete Type or GenericMapper found at the matching position.
 *
 * Performance:
 * - Stops recursion for each key as soon as a match is found (early return)
 * - Traverses rules, parent, config.type, and generic_mapper branches recursively
 *
 * @param genericObj   The generic DataTypeObject (may use generic keys in its type tree)
 * @param concreteObj  The instantiated DataTypeObject (with all generics resolved)
 * @param genericKeys  The list of all generic keys to resolve (e.g. ["D", "O", "T"])
 * @returns            Record mapping each generic key to its resolved Type or GenericMapper (or undefined if not found)
 */
const resolveAllGenericKeysInDataTypeObject = (
    genericObj: DataTypeObject,
    concreteObj: DataTypeObject,
    genericKeys: string[]
): Record<string, Type | GenericMapper | undefined> => {
    const result: Record<string, Type | GenericMapper | undefined> = {}

    // Track which keys are still missing for early return optimization
    const unresolved = new Set(genericKeys)

    function recurse(
        genericNode: any,
        concreteNode: any,
        parentConcreteMapper?: GenericMapper
    ) {
        if (!genericNode || !concreteNode || unresolved.size === 0) return

        // 1. If the current node matches a generic key and was not resolved yet
        if (typeof genericNode === "string" && unresolved.has(genericNode)) {
            if (parentConcreteMapper) {
                result[genericNode] = parentConcreteMapper
            } else if (typeof concreteNode === "string") {
                result[genericNode] = concreteNode
            } else if (
                typeof concreteNode === "object" && !Array.isArray(concreteNode) &&
                !("generic_target" in concreteNode)
            ) {
                result[genericNode] = concreteNode
            } else if (
                typeof concreteNode === "object" &&
                "generic_target" in concreteNode
            ) {
                result[genericNode] = concreteNode as GenericMapper
            }
            unresolved.delete(genericNode)
            if (unresolved.size === 0) return
        }

        // 2. Traverse rules array
        if (Array.isArray(genericNode.rules) && Array.isArray(concreteNode.rules)) {
            for (let i = 0; i < genericNode.rules.length; i++) {
                recurse(genericNode.rules[i], concreteNode.rules[i])
                if (unresolved.size === 0) return
            }
        }

        // 3. Traverse parent property
        if (genericNode.parent && concreteNode.parent) {
            recurse(genericNode.parent, concreteNode.parent)
            if (unresolved.size === 0) return
        }

        // 4. Traverse config.type property
        if (
            genericNode.config && concreteNode.config &&
            genericNode.config.type !== undefined && concreteNode.config.type !== undefined
        ) {
            recurse(genericNode.config.type, concreteNode.config.type)
            if (unresolved.size === 0) return
        }

        // 5. Traverse generic_mapper arrays
        if (
            typeof genericNode === "object" && typeof concreteNode === "object" && Array.isArray(genericNode.generic_mapper) && Array.isArray(concreteNode.generic_mapper)
        ) {
            outer: for (let i = 0; i < genericNode.generic_mapper.length; i++) {
                const genericMapper: GenericMapper = genericNode.generic_mapper[i]
                const concreteMapper = (concreteNode.generic_mapper as GenericMapper[]).find(
                    (m: GenericMapper) => m.generic_target === genericMapper.generic_target
                )
                if (!concreteMapper) continue
                for (let j = 0; j < genericMapper.types.length; j++) {
                    recurse(genericMapper.types[j], concreteMapper.types[j], concreteMapper)
                    if (unresolved.size === 0) break outer
                }
            }
        }
    }

    recurse(genericObj, concreteObj)
    return result
}








