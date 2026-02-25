import {
    DataTypeIdentifier,
    Flow, FlowType,
    NodeFunction,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFunctionReactiveService, FunctionDefinitionView} from "../d-flow-function";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {
    replaceGenericKeysInType,
    resolveType,
    resolveGenericKeys,
    targetForGenericKey
} from "../../utils/generics";

export const getReferenceType = (
    reference: ReferenceValue,
    dataTypeService: DFlowDataTypeReactiveService,
    functionService: DFlowFunctionReactiveService,
    functionDefinition?: FunctionDefinitionView,
    node?: NodeFunction,
    flowType?: FlowType
): DataTypeIdentifier | undefined => {
    let typeIdentifier: DataTypeIdentifier | undefined = undefined;
    let genericTypeMap: Map<string, any> = new Map();

    // 1. Return-Type eines Knotens
    if (reference.nodeFunctionId && (reference.inputIndex === undefined || reference.parameterIndex === undefined)) {
        const funcDef = functionDefinition;
        if (funcDef && funcDef.returnType) {
            typeIdentifier = funcDef.returnType;
            if (node && node.parameters && funcDef.parameterDefinitions) {
                const nodeValues = node.parameters.nodes?.map(p => p?.value).filter(Boolean) as any[];
                genericTypeMap = resolveGenericKeys(funcDef, nodeValues, dataTypeService, functionService);
                if (typeIdentifier) {
                    const genericTargetMap = targetForGenericKey(funcDef, typeIdentifier);
                    const genericMap = new Map(
                        Array.from(genericTypeMap.entries())
                            .filter(([, v]) => v && v.__typename === "DataTypeIdentifier")
                    );
                    const resolvedGenericMap = new Map(
                        [...genericMap.entries()].map(([key, value]) => [genericTargetMap.get(key) ?? key, value])
                    );
                    typeIdentifier = replaceGenericKeysInType(typeIdentifier, resolvedGenericMap);
                }
            }
            typeIdentifier = typeIdentifier ? resolveType(typeIdentifier, dataTypeService) : undefined;
        }
    }

    // 2. Input-Type eines Knotens
    if (
        reference.nodeFunctionId &&
        reference.inputIndex !== undefined && reference.inputIndex !== null &&
        reference.parameterIndex !== undefined && reference.parameterIndex !== null
    ) {
        const funcDef = functionDefinition;
        if (funcDef && funcDef.parameterDefinitions) {
            const paramDef = funcDef.parameterDefinitions[reference.parameterIndex];
            if (paramDef && paramDef.dataTypeIdentifier) {
                const paramDataType = dataTypeService.getDataType(paramDef.dataTypeIdentifier);
                if (paramDataType && paramDataType.rules?.nodes) {
                    const inputTypesRule = paramDataType.rules.nodes.find((r: any) => r?.variant === "INPUT_TYPES");
                    if (inputTypesRule && inputTypesRule.config) {
                        const config = inputTypesRule.config as { inputTypes?: any[] };
                        if (
                            Array.isArray(config.inputTypes) &&
                            reference.inputIndex !== undefined && reference.inputIndex !== null
                        ) {
                            const inputType = config.inputTypes[reference.inputIndex];
                            if (inputType && inputType.dataTypeIdentifier) {
                                typeIdentifier = inputType.dataTypeIdentifier;
                                if (node && node.parameters && funcDef.parameterDefinitions && typeIdentifier) {
                                    const nodeValues = node.parameters.nodes?.map(p => p?.value).filter(Boolean) as any[];
                                    genericTypeMap = resolveGenericKeys(funcDef, nodeValues, dataTypeService, functionService);
                                    const genericTargetMap = targetForGenericKey(funcDef, typeIdentifier);
                                    const genericMap = new Map(
                                        Array.from(genericTypeMap.entries())
                                            .filter(([, v]) => v && v.__typename === "DataTypeIdentifier")
                                    );
                                    const resolvedGenericMap = new Map(
                                        [...genericMap.entries()].map(([key, value]) => [genericTargetMap.get(key) ?? key, value])
                                    );
                                    typeIdentifier = replaceGenericKeysInType(typeIdentifier, resolvedGenericMap);
                                }
                                typeIdentifier = typeIdentifier ? resolveType(typeIdentifier, dataTypeService) : undefined;
                            }
                        }
                    }
                }
                // Fallback: Haupttyp
                if (!typeIdentifier) {
                    typeIdentifier = paramDef.dataTypeIdentifier;
                    if (node && node.parameters && funcDef.parameterDefinitions && typeIdentifier) {
                        const nodeValues = node.parameters.nodes?.map(p => p?.value).filter(Boolean) as any[];
                        genericTypeMap = resolveGenericKeys(funcDef, nodeValues, dataTypeService, functionService);
                        const genericTargetMap = targetForGenericKey(funcDef, typeIdentifier);
                        const genericMap = new Map(
                            Array.from(genericTypeMap.entries())
                                .filter(([, v]) => v && v.__typename === "DataTypeIdentifier")
                        );
                        const resolvedGenericMap = new Map(
                            [...genericMap.entries()].map(([key, value]) => [genericTargetMap.get(key) ?? key, value])
                        );
                        typeIdentifier = replaceGenericKeysInType(typeIdentifier, resolvedGenericMap);
                    }
                    typeIdentifier = typeIdentifier ? resolveType(typeIdentifier, dataTypeService) : undefined;
                }
            }
        }
    }

    // 3. Flow Input Type
    if (!reference.nodeFunctionId && flowType && flowType.inputType) {
        typeIdentifier = {dataType: flowType.inputType};
        typeIdentifier = typeIdentifier ? resolveType(typeIdentifier, dataTypeService) : undefined;
    }

    // 4. referencePath ablaufen und Typ weiter auflösen (rekursiv wie referenceExtraction)
    function resolveReferencePath(
        dataTypeIdentifier: DataTypeIdentifier | undefined,
        referencePath: { path: string }[] | undefined
    ): DataTypeIdentifier | undefined {
        if (!dataTypeIdentifier || !referencePath || referencePath.length === 0) return dataTypeIdentifier;
        const [current, ...rest] = referencePath;
        const dataType = dataTypeIdentifier.dataType ? dataTypeService.getDataType(dataTypeIdentifier) : dataTypeIdentifier.genericType?.dataType;
        if (!dataType || !dataType.rules?.nodes) return dataTypeIdentifier;
        const containsKeyRule = dataType.rules.nodes.find(
            (rule: any) => rule?.variant === "CONTAINS_KEY" && rule.config?.key === current.path
        );
        if (!containsKeyRule || !containsKeyRule.config) return dataTypeIdentifier;
        const config = containsKeyRule.config as { dataTypeIdentifier?: DataTypeIdentifier };
        if (!config.dataTypeIdentifier) return dataTypeIdentifier;
        return resolveReferencePath(config.dataTypeIdentifier, rest);
    }

    if (typeIdentifier && reference.referencePath && reference.referencePath.length > 0) {
        const filteredPath = reference.referencePath
            .map(p => ({ path: typeof p.path === 'string' ? p.path : undefined }))
            .filter(p => !!p.path) as { path: string }[];
        if (filteredPath.length !== reference.referencePath.length) return typeIdentifier ? resolveType(typeIdentifier, dataTypeService) : undefined;
        const resolved = resolveReferencePath(typeIdentifier, filteredPath);
        return resolved ? resolveType(resolved, dataTypeService) : undefined;
    }

    return typeIdentifier ? resolveType(typeIdentifier, dataTypeService) : undefined;
}