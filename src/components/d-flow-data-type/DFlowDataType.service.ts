import {ReactiveArrayService} from "../../utils";
import {DataTypeView} from "./DFlowDataType.view";
import {resolveType} from "../../utils/generics";
import {
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRulesContainsKeyConfig,
    DataTypeRulesInputTypesConfig,
    Flow,
    GenericMapper,
    LiteralValue,
    Maybe,
    Namespace,
    NamespaceProject,
    NodeFunctionIdWrapper,
    NodeParameterValue,
    Runtime,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {useValueValidation} from "../d-flow-validation/DValueValidation.hook";
import {findReturnNode} from "./rules/DFlowDataTypeReturnTypeRule";
import {md5} from "js-md5";

export type DFlowDataTypeDependencies = {
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
    runtimeId: Runtime['id']
}

export abstract class DFlowDataTypeReactiveService extends ReactiveArrayService<DataTypeView, DFlowDataTypeDependencies> {

    getDataType(type: DataTypeIdentifier, dependencies?: DFlowDataTypeDependencies): DataTypeView | undefined {
        if (!type) return undefined
        if ((type as DataTypeIdentifier).genericKey) return undefined
        const dataType = type.dataType ?? type.genericType?.dataType
        const identifier = dataType?.identifier
        const id = dataType?.id

        if (dataType?.rules) {
            return new DataTypeView(dataType)
        }

        return this.values().find(value => {
            return value.identifier == identifier || value.id == id
        });
    }

    getDataTypeFromValue(value: NodeParameterValue, flow?: Flow, dependencies?: DFlowDataTypeDependencies): DataTypeView | undefined {

        if (!value) return undefined

        if (value.__typename == "LiteralValue") {
            //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
            if (Array.isArray(value.value) && Array.from(value.value).length > 0) return this.getDataType({dataType: {identifier: "LIST"}})
            if (typeof value.value === "object") return this.getDataType({dataType: {identifier: "OBJECT"}}, dependencies)
            if (typeof value.value === "string") return this.getDataType({dataType: {identifier: "TEXT"}}, dependencies)
            if (typeof value.value === "number") return this.getDataType({dataType: {identifier: "NUMBER"}}, dependencies)
            if (typeof value.value === "boolean") return this.getDataType({dataType: {identifier: "BOOLEAN"}}, dependencies)
        }

        const matchingDataTypes = this.values(dependencies).filter(type => {
            if (value.__typename === "NodeFunctionIdWrapper" && (type.variant != "NODE" || !flow)) return false
            return useValueValidation(value, type, this, flow)
        })

        return matchingDataTypes[matchingDataTypes.length - 1]

    }

    getValueFromType(dataTypeIdentifier: DataTypeIdentifier, flow?: Flow, dependencies?: DFlowDataTypeDependencies): NodeParameterValue | undefined {
        const type = this.getDataType(dataTypeIdentifier, dependencies)
        if (!type) return undefined

        if (type.identifier === "TEXT") return {__typename: "LiteralValue", value: ""}
        if (type.identifier === "NUMBER") return {__typename: "LiteralValue", value: 0}
        if (type.identifier === "BOOLEAN") return {__typename: "LiteralValue", value: false}

        const rules = type.rules?.nodes ?? []
        if (rules.length === 0) return {__typename: "LiteralValue", value: null}

        const isList = rules.some(rule => rule?.variant === "CONTAINS_TYPE")
        const isObject = !isList && rules.some(rule => rule?.variant === "CONTAINS_KEY" || rule?.variant === "PARENT_TYPE")

        if (!isList && !isObject) {
            return {
                __typename: "LiteralValue",
                value: null
            }
        }

        const mappedValues = rules.map(rule => {
            if (!rule) return undefined

            if (rule.variant === "CONTAINS_TYPE" && isList) {
                // @ts-ignore
                const configId = rule.config?.dataTypeIdentifier as DataTypeIdentifier
                if (configId) {
                    const mapper = configId.genericKey && dataTypeIdentifier.genericType?.genericMappers
                        ? dataTypeIdentifier.genericType.genericMappers.find(m => m.target === configId.genericKey)
                        : undefined
                    const resolvedId = mapper?.sourceDataTypeIdentifiers?.[0] ?? configId

                    const nestedVal = this.getValueFromType(resolvedId, flow, dependencies)
                    if (nestedVal && nestedVal.__typename === "LiteralValue") {
                        return nestedVal.value
                    }
                }
            }

            if (rule.variant === "CONTAINS_KEY" && isObject) {
                const keyConfig = rule.config as DataTypeRulesContainsKeyConfig
                if (keyConfig?.key && keyConfig?.dataTypeIdentifier) {
                    const mapper = keyConfig.dataTypeIdentifier.genericKey && dataTypeIdentifier.genericType?.genericMappers
                        ? dataTypeIdentifier.genericType.genericMappers.find(m => m.target === keyConfig.dataTypeIdentifier.genericKey)
                        : undefined
                    const resolvedId = mapper?.sourceDataTypeIdentifiers?.[0] ?? keyConfig.dataTypeIdentifier

                    const nestedVal = this.getValueFromType(resolvedId, flow, dependencies)
                    if (nestedVal && nestedVal.__typename === "LiteralValue") {
                        return {[keyConfig.key]: nestedVal.value}
                    }
                }
            }

            if (rule.variant === "PARENT_TYPE" && isObject) {
                // @ts-ignore
                const configId = rule.config?.dataTypeIdentifier as DataTypeIdentifier
                if (configId) {
                    const mapper = configId.genericKey && dataTypeIdentifier.genericType?.genericMappers
                        ? dataTypeIdentifier.genericType.genericMappers.find(m => m.target === configId.genericKey)
                        : undefined
                    const resolvedId = mapper?.sourceDataTypeIdentifiers?.[0] ?? configId

                    const nestedVal = this.getValueFromType(resolvedId, flow, dependencies)
                    if (nestedVal && nestedVal.__typename === "LiteralValue" && typeof nestedVal.value === "object" && !Array.isArray(nestedVal.value)) {
                        return nestedVal.value
                    }
                }
            }

            return undefined
        }).filter(val => val !== undefined)

        return {
            __typename: "LiteralValue",
            value: isList ? mappedValues : Object.assign({}, ...mappedValues)
        }
    }

    getTypeFromValue(value: NodeParameterValue, flow?: Flow, dependencies?: DFlowDataTypeDependencies): Maybe<DataTypeIdentifier> | undefined {

        if (!value) return undefined

        if (value.__typename === "ReferenceValue") return value.dataTypeIdentifier

        const dataType = this.getDataTypeFromValue(value, flow, dependencies)
        if ((dataType?.genericKeys?.length ?? 0) <= 0 || !dataType?.genericKeys) return {dataType: {id: dataType?.id, identifier: dataType?.identifier}}

        //TODO: missing generic combinations
        const genericMapper: GenericMapper[] = dataType.genericKeys.map(genericKey => {

            const ruleThatIncludesGenericKey: Maybe<DataTypeRule> | undefined = dataType.rules?.nodes?.find((rule: DataTypeRule) => {
                // @ts-ignore
                return ("dataTypeIdentifier" in (rule?.config ?? {}) && rule?.config?.dataTypeIdentifier?.genericKey == genericKey)
                    || ("inputTypes" in (rule?.config as DataTypeRulesInputTypesConfig ?? {})) && (rule.config as DataTypeRulesInputTypesConfig).inputTypes?.some(inputType => inputType.dataTypeIdentifier?.genericKey == genericKey)
            })

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant == "CONTAINS_TYPE"
                && "value" in value && value?.value
                && dataType.variant === "ARRAY") {

                return {
                    sourceDataTypeIdentifiers: [this.getTypeFromValue({
                        __typename: "LiteralValue",
                        value: ((value as LiteralValue).value as Array<any>)[0]
                    }, flow, dependencies)],
                    target: genericKey
                } as GenericMapper
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant == "CONTAINS_KEY"
                && "value" in value && value?.value
                && dataType.variant === "OBJECT") {
                return {
                    sourceDataTypeIdentifiers: [this.getTypeFromValue({
                        __typename: "LiteralValue",
                        /* @ts-ignore */
                        value: (value.value as Object)[((ruleThatIncludesGenericKey.config as DataTypeRulesContainsKeyConfig)?.key ?? "")]
                    }, flow, dependencies)],
                    target: genericKey
                } as GenericMapper
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant == "RETURN_TYPE"
                && dataType.variant === "NODE") {

                const foundReturnFunction = findReturnNode(value as NodeFunctionIdWrapper, flow!!)
                const returnValue = foundReturnFunction?.parameters?.nodes?.[0]?.value;

                return {
                    sourceDataTypeIdentifiers: [this.getTypeFromValue(returnValue ?? {
                        __typename: "LiteralValue",
                        value: null
                    }, flow, dependencies)],
                    target: genericKey
                } as GenericMapper
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant == "INPUT_TYPES"
                && dataType.variant === "NODE") {
                return {
                    sourceDataTypeIdentifiers: [{
                        genericKey: genericKey
                    }],
                    target: genericKey
                } as GenericMapper
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant == "PARENT_TYPE"
                && dataType.identifier === "OBJECT"
                && value.__typename === "LiteralValue") {
                const rules: Array<DataTypeRule> = Object.entries(value.value).map(innerValue => {
                    return {
                        __typename: "DataTypeRule",
                        variant: "CONTAINS_KEY",
                        config: {
                            key: innerValue[0],
                            dataTypeIdentifier: this.getTypeFromValue({
                                __typename: "LiteralValue",
                                value: innerValue[1]
                            }, flow, dependencies) ?? null
                        }
                    }
                })

                const innerDataType = new DataTypeView({
                    ...dataType.json,
                    genericKeys: [],
                    identifier: md5(String(value.value)),
                    rules: {
                        nodes: rules
                    }
                })
                return {
                    sourceDataTypeIdentifiers: [{
                        dataType: innerDataType.json
                    }],
                    target: genericKey
                } as GenericMapper
            }

            return null
        }).filter(mapper => !!mapper)

        const resolvedType: DataTypeIdentifier = genericMapper.length > 0 ? {
            genericType: {
                dataType: {
                    id: dataType.id,
                    identifier: dataType.identifier,
                },
                genericMappers: genericMapper
            }
        } : {
            dataType: {
                id: dataType.id,
                identifier: dataType.identifier,
            }
        }

        return resolveType(resolvedType, this)

    }

    hasDataTypes(types: DataTypeIdentifier[], dependencies?: DFlowDataTypeDependencies): boolean {
        return types.every(type => {
            return this.values(dependencies).find(value => {
                return value.id === (type.genericType?.dataType?.id ?? type.dataType?.id)
            })
        })
    }

}
