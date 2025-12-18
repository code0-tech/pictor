import {ReactiveArrayService} from "../../utils";
import {DataTypeView} from "./DFlowDataType.view";
import {resolveType} from "../../utils/generics";
import {
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRulesContainsKeyConfig,
    DataTypeRulesInputTypesConfig, Flow,
    GenericMapper,
    LiteralValue,
    Maybe, Namespace, NamespaceProject,
    NodeParameterValue, Runtime,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {useValueValidation} from "../d-flow-validation/DValueValidation.hook";

export type DFlowDataTypeDependencies = {
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
    runtimeId: Runtime['id']
}

export abstract class DFlowDataTypeReactiveService extends ReactiveArrayService<DataTypeView, DFlowDataTypeDependencies> {

    getDataType (type: DataTypeIdentifier, dependencies?: DFlowDataTypeDependencies): DataTypeView | undefined {
        if (!type) return undefined
        if ((type as DataTypeIdentifier).genericKey) return undefined
        const identifier = (type as DataTypeIdentifier).dataType?.identifier ?? (type as DataTypeIdentifier).genericType?.dataType?.identifier
        const id = (type as DataTypeIdentifier).dataType?.id ?? (type as DataTypeIdentifier).genericType?.dataType?.id
        return this.values().find(value => {
            return value.identifier == identifier || value.id == id
        });
    }

    getDataTypeFromValue (value: NodeParameterValue, flow?: Flow, dependencies?: DFlowDataTypeDependencies): DataTypeView | undefined {

        if (!value) return undefined

        if (value.__typename == "LiteralValue") {
            //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
            if (Array.isArray(value.value) && Array.from(value.value).length > 0) return this.getDataType({dataType: {identifier: "LIST"}})
            if (typeof value.value === "string") return this.getDataType({dataType: {identifier: "TEXT"}}, dependencies)
            if (typeof value.value === "number") return this.getDataType({dataType: {identifier: "NUMBER"}}, dependencies)
            if (typeof value.value === "boolean") return this.getDataType({dataType: {identifier: "BOOLEAN"}}, dependencies)
        }

        //TODO: performance here is bad
        const matchingDataTypes = this.values(dependencies).filter(type => {
            if (type.identifier === "OBJECT") return false
            if (value.__typename === "NodeFunctionIdWrapper" && (type.variant != "NODE" || !flow)) return false
            return useValueValidation(value, type, this, flow)
        })

        return matchingDataTypes[matchingDataTypes.length - 1]

    }

    getTypeFromValue (value: NodeParameterValue, flow?: Flow, dependencies?: DFlowDataTypeDependencies): Maybe<DataTypeIdentifier> | undefined {

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
                return {
                    sourceDataTypeIdentifiers: [this.getTypeFromValue(value, flow, dependencies)],
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

            return null
        }).filter(mapper => !!mapper)

        const resolvedType: DataTypeIdentifier = genericMapper.length > 0 ? {
            genericType: {
                dataType: {id: dataType.id as Maybe<Scalars['DataTypeID']['output']>, identifier: dataType.identifier},
                genericMappers: genericMapper
            }
        } : {
            dataType: {
                id: dataType.id as Maybe<Scalars['DataTypeID']['output']>,
                identifier: dataType.identifier
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
