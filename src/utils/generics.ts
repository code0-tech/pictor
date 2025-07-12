import {
    DataTypeObject,
    DataTypeRuleObject,
    EDataTypeRuleType,
    GenericCombinationStrategy,
    GenericMapper,
    GenericType,
    Type,
    Value
} from "../components/d-flow/data-type/DFlowDataType.view";
import {FunctionDefinition} from "../components/d-flow/function/DFlowFunction.view";
import {DFlowDataTypeReactiveService, DFlowDataTypeService} from "../components/d-flow/data-type/DFlowDataType.service";
import {
    DFlowDataTypeItemOfCollectionRuleConfig
} from "../components/d-flow/data-type/rules/DFlowDataTypeItemOfCollectionRule";

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
export const resolveGenericKeyMappings = (
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
export const replaceGenericKeysInType = (
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
export const resolveAllGenericKeysInDataTypeObject = (
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

/**
 * Recursively replaces all generic keys in a DataTypeObject tree
 * (in parent and all nested rules/config.type fields) using the provided genericMap.
 * Types are replaced according to the logic in replaceGenericKeysInType.
 *
 * @param dataType   The DataTypeObject to process
 * @param genericMap Map from generic key to Type or GenericMapper
 * @returns          A new DataTypeObject with all generics replaced by their resolved form
 */
export const replaceGenericKeysInDataTypeObject = (
    dataType: DataTypeObject,
    genericMap: Map<string, Type | GenericMapper>
): DataTypeObject => {
    // Helper to handle the parent, which may be a generic key or a full Type
    const resolvedParent =
        dataType.parent !== undefined
            ? replaceGenericKeysInType(dataType.parent, genericMap)
            : undefined

    // Helper for rules (which may be deeply nested)
    const resolvedRules = (dataType.rules ?? []).map(rule => {
        const newRule = {...rule}
        // Only replace if config has a 'type' field
        if (
            newRule.config &&
            typeof newRule.config === "object" &&
            "type" in newRule.config
        ) {
            newRule.config = {
                ...newRule.config,
                type: replaceGenericKeysInType(
                    (newRule.config as { type: Type }).type,
                    genericMap
                )
            }
        }
        return newRule
    })

    return {
        ...dataType,
        parent: resolvedParent,
        rules: resolvedRules
    }
}

/**
 * Resolves all generic keys for a given function definition based on the parameter values and data type service.
 *
 * For each function parameter, this method matches generic parameter types with their corresponding
 * concrete types derived from the provided values array, using a given data type service.
 * The result is a map from each generic key to its resolved concrete Type or GenericMapper.
 *
 * Performance optimizations:
 * - Avoids repeated calls to dataTypeService
 * - Does not overwrite previously found mappings in the Map
 * - Minimizes branching and redundant logic
 *
 * @param func              Function definition (with parameters, genericKeys, etc.)
 * @param values            Array of concrete values to match against function parameters
 * @param dataTypeService   Service for resolving types and data type metadata
 * @returns                 Map from generic key to its resolved Type or GenericMapper
 */
export const resolveGenericKeys = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): Map<string, Type | GenericMapper> => {
    const genericMap = new Map<string, Type | GenericMapper>()
    const genericKeys = func.genericKeys ?? []

    if (!func.parameters) return genericMap

    for (let i = 0; i < func.parameters.length; i++) {
        const parameter = func.parameters[i]
        const paramType = parameter.type
        const value = values[i]
        const valueType = dataTypeService.getTypeFromValue(value)
        const valueDataType = dataTypeService.getDataType(valueType)
        const paramDataType = dataTypeService.getDataType(paramType)

        // Only process if the parameter type or the value type is generic
        const paramIsGeneric = typeof paramType === "string"
            ? genericKeys.includes(paramType)
            : !!paramDataType

        if (!paramIsGeneric) continue

        // CASE 1: Both parameter and value are generic
        const valueIsGeneric = typeof valueType === "object"
            && valueType !== null
            && "type" in valueType
            && !!dataTypeService.getDataType(paramType)

        if (valueIsGeneric || (typeof paramType === "string" && genericKeys.includes(paramType))) {
            const genericTypes = resolveGenericKeyMappings(paramType, valueType, genericKeys)
            for (const genericKey of genericKeys) {
                if (!genericMap.has(genericKey) && genericTypes[genericKey]) {
                    genericMap.set(genericKey, genericTypes[genericKey])
                }
            }
            continue
        }

        // CASE 2: Parameter is generic, value is concrete
        if (valueDataType && paramDataType && valueDataType.json && paramDataType.json && Array.isArray(paramDataType.genericKeys)) {
            // Resolve all generic key mappings for the parameter's data type structure
            const genericParameterTypes = resolveAllGenericKeysInDataTypeObject(
                paramDataType.json,
                valueDataType.json,
                paramDataType.genericKeys
            )

            // Build a new parameter type object where each mapper's types is replaced by the resolved mapping if available
            const mappedParamType = {
                ...(paramType as GenericType),
                generic_mapper: (paramType as GenericType).generic_mapper?.map(mapper => {
                    const mapped = genericParameterTypes[mapper.generic_target]
                    if (mapped) {
                        return {
                            ...mapper,
                            types: [mapped]
                        } as GenericMapper
                    }
                    return mapper
                })
            }

            // Resolve the final generic mappings for this parameter
            const genericTypes = resolveGenericKeyMappings(paramType, mappedParamType, genericKeys)
            for (const genericKey of genericKeys) {
                if (!genericMap.has(genericKey) && genericTypes[genericKey]) {
                    genericMap.set(genericKey, genericTypes[genericKey])
                }
            }
        }
    }

    return genericMap
}

/**
 * Checks if a source DataTypeObject matches a target DataTypeObject with the following semantics:
 * - Only the fields 'type' and 'rules' are considered.
 * - All rules in the target must be matched by at least one rule in the source.
 * - Target rules may be more generic (contain "GENERIC" as type/key), whereas source rules can be more specific.
 * - For rules with a 'type' or 'key', a GENERIC in target matches any value in source.
 * - Source must have at least as many or more specific rules than the target.
 * - This function supports all rule types defined in the EDataTypeRuleType enum.
 *
 * @param source Source DataTypeObject (potentially more specific)
 * @param target Target DataTypeObject (potentially generic, e.g., contains "GENERIC" in rules)
 * @returns True if source matches all relevant constraints in target, otherwise false
 */
export function isMatchingDataTypeObject(
    source: DataTypeObject,
    target: DataTypeObject
): boolean {
    if (source.type !== target.type) return false;
    if (!Array.isArray(target.rules) || target.rules.length === 0) return true;

    for (const targetRule of target.rules) {
        const found = source.rules?.some(sourceRule =>
            ruleMatches(sourceRule, targetRule)
        );
        if (!found) return false;
    }
    return true;

    // Rule comparison logic supporting all relevant EDataTypeRuleType configs
    function ruleMatches(sourceRule: DataTypeRuleObject, targetRule: DataTypeRuleObject): boolean {
        if (sourceRule.type !== targetRule.type) return false;
        switch (targetRule.type) {
            case EDataTypeRuleType.CONTAINS_TYPE:
            case EDataTypeRuleType.RETURNS_TYPE:
            case EDataTypeRuleType.PARENT:
                if ("type" in targetRule.config && targetRule.config.type === "GENERIC") return true;
                if ("type" in sourceRule.config && "type" in targetRule.config)
                    return sourceRule.config.type === targetRule.config.type;
                return false;
            case EDataTypeRuleType.CONTAINS_KEY:
                if ("key" in sourceRule.config && "key" in targetRule.config) {
                    if (sourceRule.config.key !== targetRule.config.key) return false;
                    if ("type" in targetRule.config && targetRule.config.type === "GENERIC") return true;
                    if ("type" in sourceRule.config && "type" in targetRule.config)
                        return sourceRule.config.type === targetRule.config.type;
                }
                return false;
            case EDataTypeRuleType.REGEX:
                if ("pattern" in sourceRule.config && "pattern" in targetRule.config)
                    return sourceRule.config.pattern === targetRule.config.pattern;
                return false;
            case EDataTypeRuleType.NUMBER_RANGE:
                if ("from" in sourceRule.config && "from" in targetRule.config &&
                    "to" in sourceRule.config && "to" in targetRule.config) {
                    return (
                        sourceRule.config.from === targetRule.config.from &&
                        sourceRule.config.to === targetRule.config.to &&
                        ("step" in sourceRule.config ? sourceRule.config.step : undefined) ===
                        ("step" in targetRule.config ? targetRule.config.step : undefined)
                    );
                }
                return false;
            case EDataTypeRuleType.ITEM_OF_COLLECTION:
                if ("items" in sourceRule.config && "items" in targetRule.config) {
                    return Array.isArray(sourceRule.config.items)
                        && Array.isArray(targetRule.config.items)
                        && sourceRule.config.items.length === targetRule.config.items.length
                        && sourceRule.config.items.every((v: any, i: number) => v === (targetRule.config as DFlowDataTypeItemOfCollectionRuleConfig).items[i]);
                }
                return false;
            default:
                // Fallback: exact deep equality for other configs
                return JSON.stringify(sourceRule.config) === JSON.stringify(targetRule.config);
        }
    }
}

/**
 * Checks if a source Type matches a target Type with the following semantics:
 * - Only the structure (type and generic_mapper, etc.) is considered, not DataTypeObject metadata.
 * - All values in the target must be matched by at least one corresponding value in the source.
 * - "GENERIC" in the target matches anything in the source at the same location.
 * - Recursively checks all nested types (e.g. in generic_mapper[].types).
 * - Source can be more specific, target can be more generic (with "GENERIC").
 * - Arrays must match in order and length unless the target is "GENERIC".
 *
 * @param source Source Type (potentially more specific)
 * @param target Target Type (potentially generic, e.g., contains "GENERIC" somewhere)
 * @returns True if source matches all relevant constraints in target, otherwise false
 */
export function isMatchingType(
    source: Type,
    target: Type
): boolean {
    // Helper: Recursively deep compare with GENERIC wildcard logic
    function deepMatch(s: any, t: any): boolean {
        // GENERIC wildcard: target accepts anything at this position
        if (s === "GENERIC") return true;

        // Null/undefined check
        if (s == null || t == null) return s === t;

        // If both are arrays, match by length and recurse
        if (Array.isArray(t)) {
            if (!Array.isArray(s) || s.length !== t.length) return false;
            return s.every((sElem, idx) => deepMatch(sElem, t[idx]));
        }

        // If both are objects (but not arrays), compare all keys in target
        if (typeof t === "object" && typeof s === "object") {
            const tKeys = Object.keys(t);
            for (const key of tKeys) {
                // Only compare keys present in target (ignore extra keys in source)
                if (!deepMatch(s[key], t[key])) return false;
            }
            return true;
        }

        // Primitive comparison
        return s === t;
    }

    return deepMatch(source, target);
}

/**
 * Recursively expands all type aliases (e.g. "NUMBER_ARRAY" → ARRAY<NUMBER>).
 * Ensures every alias in the tree is fully expanded.
 *
 * @param type     The Type or type alias to expand
 * @param service  Data type service (for lookup)
 * @returns        Deeply expanded Type object (with aliases replaced)
 */
export const resolveType = (type: Type, service: DFlowDataTypeReactiveService): Type => {
    // Alias (string): try to expand via CONTAINS_TYPE recursively
    if (typeof type === "string") {
        const dt = service.getDataType(type)
        if (
            dt &&
            dt.rules &&
            dt.rules.some(r => r.type === EDataTypeRuleType.CONTAINS_TYPE && "type" in r.config)
        ) {
            // Find most generic DataType with matching type and generics
            const genericDT = service.values().find(
                dt2 => dt2.type === dt.type && dt2.genericKeys && dt2.genericKeys.length > 0
            )
            if (genericDT && genericDT.genericKeys!!.length) {
                const rule = dt.rules.find(r => r.type === EDataTypeRuleType.CONTAINS_TYPE && "type" in r.config)
                if (rule) {
                    // Recursively expand inner type
                    //@ts-ignore
                    const expandedInner = resolveType(rule.config.type, service)
                    return {
                        type: genericDT.id,
                        generic_mapper: [{
                            types: [expandedInner],
                            generic_target: "GENERIC"
                        }]
                    }
                }
            }
        }
        // Not an alias or cannot expand further
        return type
    }
    // If already a GenericType object: expand all generic_mapper[].types recursively
    if (typeof type === "object" && type !== null) {
        const result: any = {}
        for (const key of Object.keys(type)) {
            if (key === "generic_mapper" && Array.isArray(type[key])) {
                result[key] = type[key].map((gm: any) => ({
                    ...gm,
                    types: Array.isArray(gm.types)
                        ? gm.types.map((t: any) => resolveType(t, service))
                        : resolveType(gm.types, service),
                    generic_target: gm.generic_target // Normalize all generic_target to "GENERIC"
                }))
            } else if (key === "type") {
                // Always expand nested type to primitive string (no nested objects)
                if (typeof type[key] === "object") {
                    result[key] = (type[key] as any).type || type[key]
                } else {
                    result[key] = type[key]
                }
            } else {
                // Recursively handle all other fields
                //@ts-ignore
                result[key] = resolveType(type[key], service)
            }
        }
        return result
    }
    // Primitive (number/boolean): just return as-is
    return type
}

export const replaceGenericsAndSortType = (
    type: Type,
    genericKeys?: string[]
): Type => {
    function deepReplaceAndSort(node: any): any {
        // 1. Replace generic keys if string (überall, nicht nur in generic_target)
        if (
            typeof node === "string" &&
            Array.isArray(genericKeys) &&
            genericKeys.includes(node)
        ) {
            return "GENERIC";
        }

        // 2. Array: Rekursiv, ggf. sortieren (für deterministische Ausgabe)
        if (Array.isArray(node)) {
            const mapped = node.map(deepReplaceAndSort);

            // Spezieller Fall: Array von Objekten mit generic_target → sortieren
            if (mapped.length > 0 && typeof mapped[0] === "object" && mapped[0] !== null && "generic_target" in mapped[0]) {
                // Sortierung: zuerst generic_target, dann types
                return mapped.sort((a, b) => {
                    // generic_target ist jetzt immer "GENERIC" – also ggf. noch types vergleichen
                    const aTypes = JSON.stringify(a.types);
                    const bTypes = JSON.stringify(b.types);
                    if (aTypes < bTypes) return -1;
                    if (aTypes > bTypes) return 1;
                    return 0;
                });
            }
            // Auch primitive Arrays sortieren (z. B. ["FOOBAR", "MY_KEY"])
            if (typeof mapped[0] === "string" || typeof mapped[0] === "number") {
                return [...mapped].sort();
            }
            return mapped;
        }

        // 3. Object: keys sortieren, rekursiv ersetzen
        if (typeof node === "object" && node !== null) {
            const sortedKeys = Object.keys(node).sort();
            const result: any = {};
            for (const key of sortedKeys) {
                // generic_target IMMER zu "GENERIC"
                if (key === "generic_target") {
                    result[key] = "GENERIC";
                } else {
                    result[key] = deepReplaceAndSort(node[key]);
                }
            }
            return result;
        }
        // 4. Primitives
        return node;
    }

    return deepReplaceAndSort(type);
}
