import {useService} from "../../../utils/contextStore";
import {DFlowSuggestionService} from "./DFlowSuggestion.service";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {EDataTypeRuleType, Type} from "../data-type/DFlowDataType.view";
import {md5} from 'js-md5';
import {DFlowSuggestion} from "./DFlowSuggestion.view";
import React from "react";

export const useSuggestions = (type: Type): DFlowSuggestion[] | undefined => {

    const suggestionService = useService(DFlowSuggestionService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const hashedType = useTypeHash(type);
    const cached = suggestionService.getSuggestionsByHash(hashedType || "");
    const [state, setState] = React.useState(() => {
        if (!hashedType) return [];
        return cached || [];
    })

    React.useEffect(() => {

        //check for possible direct values. Currently only for step rules

        //check for functions that return a matching type

        //check for ref objects

    }, [type, suggestionService, dataTypeService])


    return state

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

    /**
     * Recursively expands all type aliases (e.g. "NUMBER_ARRAY" → ARRAY<NUMBER>).
     * Ensures every alias in the tree is fully expanded.
     *
     * @param type     The Type or type alias to expand
     * @param service  Data type service (for lookup)
     * @returns        Deeply expanded Type object (with aliases replaced)
     */
    function expandTypeAliases(type: Type, service: DFlowDataTypeReactiveService): Type {
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
                        const expandedInner = expandTypeAliases(rule.config.type, service)
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
                            ? gm.types.map((t: any) => expandTypeAliases(t, service))
                            : expandTypeAliases(gm.types, service),
                        generic_target: "GENERIC" // Normalize all generic_target to "GENERIC"
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
                    result[key] = expandTypeAliases(type[key], service)
                }
            }
            return result
        }
        // Primitive (number/boolean): just return as-is
        return type
    }

    function replaceGenericsAndSortTypeObject(
        type: Type,
        genericKeys?: string[]
    ): Type {
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


    // 1. Expand all aliases and deeply unify generics
    const expandedType = expandTypeAliases(type, dataTypeService)
    // 2. Replace generics and sort keys for canonicalization
    const canonical = replaceGenericsAndSortTypeObject(expandedType, generic_keys)
    // 3. Stable stringification for MD5
    const stableString = JSON.stringify(canonical)

    // 4. MD5 hash
    return md5(stableString)
}
