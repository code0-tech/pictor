import {FunctionDefinition} from "./DFlowFunction.view";
import {
    DataTypeObject,
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

    const genericMap = new Map<string, Type | GenericMapper>()

    const parameterValidation = func.parameters?.every((parameter, index) => {

        const typeFromValue = dataTypeService.getTypeFromValue(values[index])
        const dataTypeFromValue = dataTypeService.getDataType(typeFromValue)
        const typeFromParameter = parameter.type
        const dataTypeFromParameter = dataTypeService.getDataType(typeFromParameter)

        console.log(typeFromParameter, typeFromValue)

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

            } else if (dataTypeService.getDataType(typeFromValue) && dataTypeFromParameter && dataTypeFromValue && dataTypeFromParameter.genericKeys) {

                //parameter is generic but value not
                const genericTypes = resolveAllGenericKeysInDataTypeObject(dataTypeFromParameter.json, dataTypeFromValue.json, dataTypeFromParameter.genericKeys)

                //store generic mapped real type in map
                func.genericKeys?.forEach(genericKey => {
                    if (genericTypes[genericKey])
                        genericMap.set(genericKey, genericMap.get(genericKey) || genericTypes[genericKey])
                })

                const replacedGenericMapper = replaceGenericKeysInType(parameter.type, genericMap) as Type
                return dataTypeService.getDataType(replacedGenericMapper)?.validateValue(values[index])
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
                return dataTypeFromParameter?.validateValue(values[index])

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
 * Recursively replaces all generic keys in a parameter type tree with their resolved concrete types.
 * If a mapping entry for a generic key is a GenericMapper, its types are inlined into the parent mapper,
 * but the parent's generic_target and other properties are preserved. This function guarantees
 * that the resulting structure is always a valid Type (never a standalone GenericMapper).
 *
 * @param type       The parameter type to process (could be a string or a type object)
 * @param genericMap A Map where each generic key maps to a Type or a GenericMapper as replacement
 * @returns          The type tree with all generic keys replaced by their resolved form
 */
const replaceGenericKeysInType = (
    type: Type,
    genericMap: Map<string, Type | GenericMapper>
): Type => {
    // If this node is a generic key and there's a replacement in the map...
    if (typeof type === "string" && genericMap.has(type)) {
        const replacement = genericMap.get(type)
        // If the replacement is a valid Type (string or has a 'type' field), just use it directly
        if (
            typeof replacement === "string" ||
            (typeof replacement === "object" && replacement !== null && "type" in replacement)
        ) {
            return replacement as Type
        }
        // If the replacement is a GenericMapper, we DO NOT return it directly
        // (It will be inlined in the parent generic_mapper context—handled below)
        // Fallback: return the generic key as-is, which is safe in this edge-case
        return type
    }
    // If this node is a string and not a generic key, return as-is
    if (typeof type === "string") {
        return type
    }

    // If this node is a type object, process all its generic_mapper entries recursively
    const newGenericMapper = (type.generic_mapper ?? []).map(gm => {
        let resultTypes: Type[] = []
        for (const t of gm.types) {
            // Check if 't' is a generic key with a mapping
            if (typeof t === "string" && genericMap.has(t)) {
                const replacement = genericMap.get(t)
                if (
                    replacement &&
                    typeof replacement === "object" &&
                    "types" in replacement &&
                    Array.isArray(replacement.types)
                ) {
                    // If replacement is a GenericMapper: inline all its types into the parent
                    resultTypes.push(...replacement.types)
                } else if (
                    typeof replacement === "string" ||
                    (typeof replacement === "object" && replacement !== null && "type" in replacement)
                ) {
                    // If replacement is a valid Type: insert it
                    resultTypes.push(replacement as Type)
                } else {
                    // Defensive fallback: insert the original key
                    resultTypes.push(t)
                }
            } else if (typeof t === "object" && t !== null) {
                // Recursively process any nested type objects
                resultTypes.push(replaceGenericKeysInType(t, genericMap))
            } else {
                // Fallback for unknown values (shouldn't happen)
                resultTypes.push(t)
            }
        }
        // Always preserve all other properties of the parent GenericMapper
        return {
            ...gm,
            types: resultTypes
        }
    })

    // Return the new type object with all generics replaced/inlined
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
 * - Traverses rules, parent, config. Type, and generic_mapper branches recursively
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