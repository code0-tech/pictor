import {FunctionDefinitionView} from "../components/d-flow-function/DFlowFunction.view";
import {DFlowDataTypeReactiveService} from "../components/d-flow-data-type/DFlowDataType.service";
import type {
    DataType,
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRuleConnection,
    DataTypeRulesConfig,
    Flow,
    GenericCombinationStrategyType,
    GenericMapper,
    GenericType,
    NodeParameterValue
} from "@code0-tech/sagittarius-graphql-types";

const GENERIC_PLACEHOLDER = "GENERIC";

type IdentifierLike = DataTypeIdentifier | string | undefined | null;

type GenericMappingResult = Record<string, DataTypeIdentifier>;

type GenericReplacement = DataTypeIdentifier | GenericMapper;

export type GenericMap = Map<string, GenericReplacement>;
export type GenericTargetMap = Map<string, string>;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isDataTypeIdentifier = (value: unknown): value is DataTypeIdentifier => {
    if (!isPlainObject(value)) return false;
    return (
        "genericKey" in value ||
        "genericType" in value ||
        "dataType" in value
    );
};

const isGenericMapper = (value: GenericMapper): value is GenericMapper => {
    return isPlainObject(value) && "target" in value && Array.isArray((value as GenericMapper).sourceDataTypeIdentifiers);
};

const isDataType = (value: unknown): value is DataType => {
    return isPlainObject(value) && "variant" in value && "identifier" in value;
};

const isDataTypeRule = (value: unknown): value is DataTypeRule => {
    return isPlainObject(value) && "variant" in value && "config" in value;
};

const extractIdentifierId = (identifier: IdentifierLike): string | undefined => {
    if (!identifier) return undefined;
    if (typeof identifier === "string") return identifier;
    return (
        identifier?.dataType?.identifier ??
        identifier?.genericType?.dataType?.identifier
    ) ?? undefined;
};

const extractIdentifierGenericKey = (
    identifier: IdentifierLike,
    genericKeys?: Set<string>
): string | undefined => {
    if (!identifier) return undefined;
    if (typeof identifier === "string") {
        if (genericKeys && genericKeys.has(identifier)) return identifier;
        return undefined;
    }
    return identifier.genericKey ?? undefined;
};

const getIdentifierMappers = (identifier: IdentifierLike): GenericMapper[] => {
    if (!identifier || typeof identifier === "string") return [];
    return identifier.genericType?.genericMappers ?? [];
};

const cloneMapperWithSources = (
    mapper: GenericMapper,
    sourceDataTypeIdentifiers: DataTypeIdentifier[]
): GenericMapper => {
    return {
        ...mapper,
        sourceDataTypeIdentifiers: sourceDataTypeIdentifiers
    };
};

const toCombinationTypes = (mapper: GenericMapper): Set<GenericCombinationStrategyType> => {
    const strategies = mapper.genericCombinationStrategies ?? [];
    return new Set(strategies.map(strategy => strategy.type!!));
};

const normalizeObjectForComparison = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(normalizeObjectForComparison);
    }

    if (isPlainObject(value)) {
        const normalized: Record<string, unknown> = {};
        Object.entries(value).forEach(([key, val]) => {
            if (key === "__typename" || key === "id" || key === "createdAt" || key === "updatedAt") return;
            normalized[key] = normalizeObjectForComparison(val);
        });
        return normalized;
    }

    return value;
};

const identifiersMatch = (
    source: IdentifierLike,
    target: IdentifierLike
): boolean => {
    if (!target) return !source;
    if (typeof target === "string") {
        if (target === GENERIC_PLACEHOLDER) return true;
        return extractIdentifierId(source) === target;
    }

    const genericKey = target.genericKey;
    if (genericKey) return true;

    const targetId = extractIdentifierId(target);
    const sourceId = extractIdentifierId(source);
    return !!targetId && targetId === sourceId;
};

const replaceIdentifiersInConfig = (
    config: DataTypeRulesConfig,
    genericMap: GenericMap
): DataTypeRulesConfig => {
    switch (config.__typename) {
        case "DataTypeRulesContainsKeyConfig":
        case "DataTypeRulesContainsTypeConfig":
        case "DataTypeRulesReturnTypeConfig": {
            const identifier = (config as { dataTypeIdentifier?: DataTypeIdentifier }).dataTypeIdentifier;
            if (!identifier) return config;
            return {
                ...config,
                dataTypeIdentifier: replaceGenericKeysInType(identifier, genericMap)
            } as DataTypeRulesConfig;
        }
        case "DataTypeRulesInputTypesConfig": {
            const typedConfig = config;
            const inputTypes = typedConfig.inputTypes?.map(inputType => ({
                ...inputType,
                dataTypeIdentifier: replaceGenericKeysInType(inputType.dataTypeIdentifier!!, genericMap)
            }));
            return {
                ...typedConfig,
                inputTypes
            };
        }
        default:
            return config;
    }
};

export const resolveGenericKeyMappings = (
    parameterType: DataTypeIdentifier,
    valueType: DataTypeIdentifier,
    genericKeys: string[]
): GenericMappingResult => {
    const result: GenericMappingResult = {};
    const genericKeySet = new Set(genericKeys);

    const recurse = (param: DataTypeIdentifier, value: DataTypeIdentifier) => {
        if (!param || !value) return;

        const paramKey = extractIdentifierGenericKey(param, genericKeySet);
        if (paramKey && genericKeySet.has(paramKey)) {
            if (isDataTypeIdentifier(value)) {
                result[paramKey] = value;
            }
            return;
        }

        const paramMappers = getIdentifierMappers(param);
        if (paramMappers.length === 0) return;

        const valueMappers = getIdentifierMappers(value);

        for (const paramMapper of paramMappers) {
            const matchingValueMapper = valueMappers.find(mapper => mapper.target === paramMapper.target);
            if (!matchingValueMapper) continue;

            const keysInSources = (paramMapper.sourceDataTypeIdentifiers ?? [])
                .map(source => extractIdentifierGenericKey(source, genericKeySet))
                .filter((key): key is string => !!key && genericKeySet.has(key));

            const combination = toCombinationTypes(paramMapper);
            const valueSources = matchingValueMapper.sourceDataTypeIdentifiers ?? [];

            if (
                (combination.has("AND" as GenericCombinationStrategyType.And) || combination.has("OR" as GenericCombinationStrategyType.Or)) &&
                valueSources.length === 1 &&
                keysInSources.length === (paramMapper.sourceDataTypeIdentifiers?.length ?? 0)
            ) {
                for (const key of keysInSources) {
                    result[key] = valueSources[0];
                }
            } else {
                const length = Math.min(paramMapper.sourceDataTypeIdentifiers?.length ?? 0, valueSources.length);
                for (let index = 0; index < length; index++) {
                    recurse(paramMapper.sourceDataTypeIdentifiers!![index], valueSources[index]);
                }
            }
        }
    };

    recurse(parameterType, valueType);
    return result;
};

export const replaceGenericKeysInType = (
    type: DataTypeIdentifier,
    genericMap: GenericMap
): DataTypeIdentifier => {
    if (!isDataTypeIdentifier(type)) return type;

    const {genericKey, genericType} = type;

    if (genericKey && genericMap.has(genericKey)) {
        const replacement = genericMap.get(genericKey);
        if (replacement && isDataTypeIdentifier(replacement)) {
            return replacement;
        }
        return type;
    }

    if (!genericType) return type;

    const resolvedMappers = (genericType.genericMappers ?? []).map(mapper => {
        const resolvedSources: DataTypeIdentifier[] = [];

        for (const source of mapper.sourceDataTypeIdentifiers ?? []) {
            if (!source) continue;
            const sourceKey = source.genericKey;
            if (sourceKey && genericMap.has(sourceKey)) {
                const replacement = genericMap.get(sourceKey);
                if (replacement && isGenericMapper(replacement as GenericMapper)) {
                    resolvedSources.push(...(replacement as GenericMapper).sourceDataTypeIdentifiers!!);
                } else if (replacement && isDataTypeIdentifier(replacement)) {
                    resolvedSources.push(replacement);
                } else {
                    resolvedSources.push(source);
                }
            } else if (isDataTypeIdentifier(source)) {
                resolvedSources.push(replaceGenericKeysInType(source, genericMap));
            } else {
                resolvedSources.push(source as DataTypeIdentifier);
            }
        }

        return cloneMapperWithSources(mapper, resolvedSources);
    });

    return {
        ...type,
        genericType: {
            ...genericType,
            genericMappers: resolvedMappers
        }
    };
};

export const resolveAllGenericKeysInDataTypeObject = (
    genericObj: DataType,
    concreteObj: DataType,
    genericKeys: string[]
): Record<string, GenericReplacement | undefined> => {
    const result: Record<string, GenericReplacement | undefined> = {};
    const unresolved = new Set(genericKeys);

    const visit = (
        genericNode: unknown,
        concreteNode: unknown,
        parentMapper?: GenericMapper
    ) => {
        if (!genericNode || !concreteNode || unresolved.size === 0) return;

        if (isDataTypeIdentifier(genericNode)) {
            const key = genericNode.genericKey;
            if (key && unresolved.has(key)) {
                if (parentMapper) {
                    result[key] = parentMapper;
                } else if (isGenericMapper(concreteNode as GenericMapper)) {
                    result[key] = concreteNode as GenericMapper;
                } else if (isDataTypeIdentifier(concreteNode)) {
                    result[key] = concreteNode;
                }
                unresolved.delete(key);
                if (unresolved.size === 0) return;
            }
        }

        if (isGenericMapper(genericNode as GenericMapper) && isGenericMapper(concreteNode as GenericMapper)) {
            const length = Math.min((genericNode as GenericMapper).sourceDataTypeIdentifiers?.length!!, (concreteNode as GenericMapper).sourceDataTypeIdentifiers?.length!!);
            for (let index = 0; index < length; index++) {
                visit((genericNode as GenericMapper).sourceDataTypeIdentifiers!![index], (concreteNode as GenericMapper).sourceDataTypeIdentifiers!![index], concreteNode as GenericMapper);
                if (unresolved.size === 0) return;
            }
            return;
        }

        if (isDataType(genericNode) && isDataType(concreteNode)) {
            const genericRules = genericNode.rules?.nodes ?? [];
            const concreteRules = concreteNode.rules?.nodes ?? [];
            const length = Math.min(genericRules.length, concreteRules.length);

            for (let index = 0; index < length; index++) {
                const genericRule = genericRules[index];
                const concreteRule = concreteRules[index];
                if (!genericRule || !concreteRule) continue;
                visit(genericRule, concreteRule);
                if (unresolved.size === 0) return;
            }
            return;
        }

        if (isDataTypeRule(genericNode) && isDataTypeRule(concreteNode)) {
            visit(genericNode.config, concreteNode.config);
            return;
        }

        if (Array.isArray(genericNode) && Array.isArray(concreteNode)) {
            const length = Math.min(genericNode.length, concreteNode.length);
            for (let index = 0; index < length; index++) {
                visit(genericNode[index], concreteNode[index], parentMapper);
                if (unresolved.size === 0) return;
            }
            return;
        }

        if (isPlainObject(genericNode) && isPlainObject(concreteNode)) {
            for (const key of Object.keys(genericNode)) {
                if (!(key in concreteNode)) continue;
                if (key === "__typename") continue;
                visit((genericNode as Record<string, unknown>)[key], (concreteNode as Record<string, unknown>)[key], parentMapper);
                if (unresolved.size === 0) return;
            }
        }
    };

    visit(genericObj, concreteObj);
    return result;
};

export const replaceGenericKeysInDataTypeObject = (
    dataType: DataType,
    genericMap: GenericMap
): DataType => {

    const resolvedRules = dataType.rules
        ? {
            ...dataType.rules,
            nodes: dataType.rules.nodes?.map(rule => {
                if (!rule) return rule;
                return {
                    ...rule,
                    config: replaceIdentifiersInConfig(rule.config!!, genericMap)
                } as DataTypeRule;
            })
        }
        : undefined;

    return {
        ...dataType,
        rules: resolvedRules as DataTypeRuleConnection
    };
};

export const resolveGenericKeys = (
    func: FunctionDefinitionView,
    values: NodeParameterValue[],
    dataTypeService: DFlowDataTypeReactiveService,
    flow?: Flow
): GenericMap => {
    const genericMap: GenericMap = new Map();
    const genericKeys = func?.genericKeys ?? [];

    if (!func?.parameterDefinitions || genericKeys.length <= 0) return genericMap;

    const genericKeySet = new Set(genericKeys);

    func.parameterDefinitions.forEach((parameter, index) => {
        const parameterType = parameter.dataTypeIdentifier as DataTypeIdentifier;
        const value = values[index];
        const valueType = dataTypeService.getTypeFromValue(value, flow) as DataTypeIdentifier;

        if (!parameterType || !valueType) return;

        const mappings = resolveGenericKeyMappings(
            parameterType,
            valueType,
            genericKeys
        );

        for (const [key, identifier] of Object.entries(mappings)) {
            if (!genericKeySet.has(key)) continue;
            if (!genericMap.has(key)) {
                genericMap.set(key, identifier);
            }
        }
    });

    return genericMap;
};

export function isMatchingDataTypeObject(
    source: DataType,
    target: DataType
): boolean {
    if (source.variant !== target.variant) return false;
    const targetRules = target.rules?.nodes ?? [];
    if (targetRules.length === 0) return true;

    const sourceRules = source.rules?.nodes ?? [];

    for (const targetRule of targetRules) {
        if (!targetRule) continue;
        const found = sourceRules.some(sourceRule => {
            if (!sourceRule) return false;
            return ruleMatches(sourceRule, targetRule);
        });
        if (!found) return false;
    }

    return true;
}

function ruleMatches(sourceRule: DataTypeRule, targetRule: DataTypeRule): boolean {
    if (sourceRule.variant !== targetRule.variant) return false;

    switch (targetRule.variant) {
        case "CONTAINS_TYPE":
        case "RETURN_TYPE":
            return identifiersMatch(
                (sourceRule.config as { dataTypeIdentifier?: DataTypeIdentifier }).dataTypeIdentifier,
                (targetRule.config as { dataTypeIdentifier?: DataTypeIdentifier }).dataTypeIdentifier
            );
        case "CONTAINS_KEY": {
            const sourceConfig = sourceRule.config as { key: string; dataTypeIdentifier?: DataTypeIdentifier };
            const targetConfig = targetRule.config as { key: string; dataTypeIdentifier?: DataTypeIdentifier };
            if (sourceConfig.key !== targetConfig.key) return false;
            return identifiersMatch(sourceConfig.dataTypeIdentifier, targetConfig.dataTypeIdentifier);
        }
        case "INPUT_TYPES": {
            const sourceConfig = sourceRule.config as {
                inputTypes?: Array<{ dataTypeIdentifier: DataTypeIdentifier }>
            };
            const targetConfig = targetRule.config as {
                inputTypes?: Array<{ dataTypeIdentifier: DataTypeIdentifier }>
            };
            const targetInputTypes = targetConfig.inputTypes ?? [];
            const sourceInputTypes = sourceConfig.inputTypes ?? [];
            return targetInputTypes.every(targetInput =>
                sourceInputTypes.some(sourceInput =>
                    identifiersMatch(sourceInput.dataTypeIdentifier, targetInput.dataTypeIdentifier)
                )
            );
        }
        case "ITEM_OF_COLLECTION": {
            const sourceItems = (sourceRule.config as { items?: unknown[] }).items ?? [];
            const targetItems = (targetRule.config as { items?: unknown[] }).items ?? [];
            if (sourceItems.length !== targetItems.length) return false;
            return sourceItems.every((item, index) => item === targetItems[index]);
        }
        case "NUMBER_RANGE": {
            const sourceConfig = sourceRule.config as { from: number; to: number; steps?: number };
            const targetConfig = targetRule.config as { from: number; to: number; steps?: number };
            return (
                sourceConfig.from === targetConfig.from &&
                sourceConfig.to === targetConfig.to &&
                sourceConfig.steps === targetConfig.steps
            );
        }
        case "REGEX": {
            const sourcePattern = (sourceRule.config as { pattern: string }).pattern;
            const targetPattern = (targetRule.config as { pattern: string }).pattern;
            return sourcePattern === targetPattern;
        }
        default:
            return JSON.stringify(normalizeObjectForComparison(sourceRule.config)) ===
                JSON.stringify(normalizeObjectForComparison(targetRule.config));
    }
}

export function isMatchingType(
    source: DataTypeIdentifier,
    target: DataTypeIdentifier
): boolean {
    const wildcard = (value: unknown): boolean => {
        if (value === GENERIC_PLACEHOLDER) return true;
        if (isDataTypeIdentifier(value) && value.genericKey) return true;
        return false;
    };

    const deepMatch = (s: unknown, t: unknown): boolean => {
        if (wildcard(s) || wildcard(t)) return true;
        if (s == null || t == null) return s === t;

        if (Array.isArray(t)) {
            if (!Array.isArray(s) || s.length !== t.length) return false;
            return s.every((value, index) => deepMatch(value, t[index]));
        }

        if (isPlainObject(t)) {
            if (!isPlainObject(s)) return false;
            const keys = Object.keys(t);
            return keys.every(key => deepMatch((s as Record<string, unknown>)[key], (t as Record<string, unknown>)[key]));
        }

        return s === t;
    };

    const normalizedSource = normalizeObjectForComparison(source);
    const normalizedTarget = normalizeObjectForComparison(target);
    return deepMatch(normalizedSource, normalizedTarget);
}

export const resolveType = (
    type: DataTypeIdentifier,
    service: DFlowDataTypeReactiveService
): DataTypeIdentifier => {
    if (typeof (type as unknown) === "string") {
        const dataType = service.getDataType(type);
        if (!dataType) return type;
        const genericKeys = dataType.genericKeys ?? [];

        if (dataType.variant === "ARRAY" && genericKeys.length > 0) {
            const innerTypeRule = dataType.rules?.nodes?.find(rule => rule?.variant === "CONTAINS_TYPE");
            const innerIdentifier = (innerTypeRule?.config as {
                dataTypeIdentifier?: DataTypeIdentifier
            })?.dataTypeIdentifier;
            if (innerIdentifier) {
                const [genericKey] = genericKeys;
                if (!genericKey) return type;
                return {
                    dataType: dataType.json as DataType,
                    genericType: {
                        dataType: dataType.json as DataType,
                        genericMappers: [
                            {
                                target: genericKey,
                                sourceDataTypeIdentifiers: [resolveType(innerIdentifier, service)]
                            }
                        ]
                    }
                } as DataTypeIdentifier;
            }
        }

        return type;
    }

    if (!isDataTypeIdentifier(type)) return type;

    if (!type.genericType) return type;

    const resolvedMappers = type.genericType.genericMappers?.map(mapper => ({
        ...mapper,
        sourceDataTypeIdentifiers: mapper?.sourceDataTypeIdentifiers?.map(source => resolveType(source, service))
    })) ?? [];

    return {
        ...type,
        genericType: {
            ...type.genericType,
            genericMappers: resolvedMappers
        }
    };
};

const sortValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        const mapped = value.map(sortValue);
        if (mapped.length <= 1) return mapped;

        const allPlainObjects = mapped.every(isPlainObject);
        if (allPlainObjects) {
            return [...mapped].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        }

        const allPrimitive = mapped.every(item => !Array.isArray(item) && !isPlainObject(item));
        if (allPrimitive) {
            return [...mapped].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        }

        return mapped;
    }

    if (isPlainObject(value)) {
        const recordValue = value as Record<string, unknown>;
        return Object.keys(recordValue)
            .sort()
            .reduce<Record<string, unknown>>((acc, key) => {
                acc[key] = sortValue(recordValue[key]);
                return acc;
            }, {});
    }

    return value;
};

export const targetForGenericKey = (func: FunctionDefinitionView, target: DataTypeIdentifier): GenericTargetMap => {
    if (!target.genericType) return new Map()

    const genericKeySet = new Set(func.genericKeys ?? []);
    const targetMap: GenericTargetMap = new Map();

    for (const mapper of target.genericType.genericMappers ?? []) {
        const targetKey = mapper.target!;
        if (genericKeySet.has(targetKey)) continue;

        for (const source of mapper.sourceDataTypeIdentifiers ?? []) {
            const sourceKey = source.genericKey;
            if (sourceKey && genericKeySet.has(sourceKey)) {
                targetMap.set(sourceKey, targetKey);
            }
        }
    }

    return targetMap

}

export const replaceGenericsAndSortType = (
    type: DataTypeIdentifier,
    genericKeys: string[] = []
): DataTypeIdentifier => {
    const genericKeySet = new Set(genericKeys);

    const shouldReplace = (key: string | undefined | null): boolean => {
        if (!key) return false;
        if (genericKeySet.size === 0) return true;
        return genericKeySet.has(key);
    };

    const replaceMapper = (mapper: GenericMapper): GenericMapper => {
        const replaceTarget = shouldReplace(mapper.target);
        const target = replaceTarget ? GENERIC_PLACEHOLDER : mapper.target;
        const sources = (mapper.sourceDataTypeIdentifiers ?? []).map(source => visit(source) as DataTypeIdentifier);

        return sortValue({
            ...mapper,
            target,
            sourceDataTypeIdentifiers: sources
        }) as GenericMapper;
    };

    const replaceIdentifier = (identifier: DataTypeIdentifier): DataTypeIdentifier => {
        const replaceKey = shouldReplace(identifier.genericKey);
        const genericKey = replaceKey ? GENERIC_PLACEHOLDER : identifier.genericKey;

        const replaced = {
            ...identifier,
            genericKey,
            dataType: identifier.dataType ? (visit(identifier.dataType) as DataType) : identifier.dataType,
            genericType: identifier.genericType ? (visit(identifier.genericType) as GenericType) : identifier.genericType
        };

        return sortValue(replaced) as DataTypeIdentifier;
    };

    function visit(value: unknown): unknown {
        if (value == null) return value;

        if (Array.isArray(value)) {
            const mapped = value.map(item => visit(item));
            return sortValue(mapped);
        }

        if (isDataTypeIdentifier(value)) {
            return replaceIdentifier(value as DataTypeIdentifier);
        }

        if (isGenericMapper(value as GenericMapper)) {
            return replaceMapper(value as GenericMapper);
        }

        if (isPlainObject(value)) {
            const entries = Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((acc, [key, val]) => {
                acc[key] = visit(val);
                return acc;
            }, {});

            return sortValue(entries);
        }

        return value;
    }

    return visit(type) as DataTypeIdentifier;
};
