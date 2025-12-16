import {ReactiveArrayService} from "../../utils";
import {DataTypeView} from "./DFlowDataType.view";
import {resolveType} from "../../utils/generics";
import type {
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRulesContainsKeyConfig,
    DataTypeRulesInputTypesConfig, Flow,
    GenericMapper,
    LiteralValue,
    Maybe,
    NodeParameterValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {useValueValidation} from "../d-flow-validation/DValueValidation.hook";

export abstract class DFlowDataTypeReactiveService extends ReactiveArrayService<DataTypeView> {

    getDataType (type: DataTypeIdentifier): DataTypeView | undefined {
        if (!type) return undefined
        if ((type as DataTypeIdentifier).genericKey) return undefined
        const identifier = (type as DataTypeIdentifier).dataType?.identifier ?? (type as DataTypeIdentifier).genericType?.dataType?.identifier
        const id = (type as DataTypeIdentifier).dataType?.id ?? (type as DataTypeIdentifier).genericType?.dataType?.id
        return this.values().find(value => {
            return value.identifier == identifier || value.id == id
        });
    }

    getDataTypeFromValue (value: NodeParameterValue, flow?: Flow): DataTypeView | undefined {

        if (!value) return undefined

        if (value.__typename == "LiteralValue") {
            //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
            if (Array.isArray(value.value) && Array.from(value.value).length > 0) return this.getDataType({dataType: {identifier: "ARRAY"}})
            if (typeof value.value === "string") return this.getDataType({dataType: {identifier: "TEXT"}})
            if (typeof value.value === "number") return this.getDataType({dataType: {identifier: "NUMBER"}})
            if (typeof value.value === "boolean") return this.getDataType({dataType: {identifier: "BOOLEAN"}})
        }

        //TODO: performance here is bad
        const matchingDataTypes = this.values().filter(type => {
            if (type.identifier === "OBJECT") return false
            if (value.__typename === "NodeFunctionIdWrapper" && (type.variant != "NODE" || !flow)) return false
            return useValueValidation(value, type, this, flow)
        })

        return matchingDataTypes[matchingDataTypes.length - 1]

    }

    getTypeFromValue (value: NodeParameterValue, flow?: Flow): Maybe<DataTypeIdentifier> | undefined {

        if (!value) return undefined

        if (value.__typename === "ReferenceValue") return value.dataTypeIdentifier

        const dataType = this.getDataTypeFromValue(value, flow)
        if ((dataType?.genericKeys?.length ?? 0) <= 0 || !dataType?.genericKeys) return {dataType: {id: dataType?.id}}

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
                    }, flow)],
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
                    }, flow)],
                    target: genericKey
                } as GenericMapper
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant == "RETURN_TYPE"
                && dataType.variant === "NODE") {
                return {
                    sourceDataTypeIdentifiers: [this.getTypeFromValue(value, flow)],
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
                dataType: {id: dataType.id as Maybe<Scalars['DataTypeID']['output']>},
                genericMappers: genericMapper
            }
        } : {
            dataType: {
                id: dataType.id as Maybe<Scalars['DataTypeID']['output']>
            }
        }

        return resolveType(resolvedType, this)

    }

    hasDataTypes(types: DataTypeIdentifier[]): boolean {
        return types.every(type => {
            return this.values().find(value => {
                return value.id === (type.genericType?.dataType?.id ?? type.dataType?.id)
            })
        })
    }

}
