import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {DataTypeView} from "./DFlowDataType.view";
import {resolveType} from "../../../utils/generics";
import {
    DataTypeIdentifier,
    DataTypeRule,
    DataTypeRulesVariant,
    DataTypeVariant,
    Maybe,
    NodeParameterValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {useValidateValue} from "./DFlowDataType.validation.value";

export interface DFlowDataTypeService {
    getDataType(type: DataTypeIdentifier): DataTypeView | undefined

    hasDataTypes(types: DataTypeIdentifier[]): boolean

    getDataTypeFromValue(value: NodeParameterValue): DataTypeView | undefined

    getTypeFromValue(value: NodeParameterValue): Maybe<DataTypeIdentifier> | undefined
}

export class DFlowDataTypeReactiveService extends ReactiveArrayService<DataTypeView> implements DFlowDataTypeService {

    constructor(store: ReactiveArrayStore<DataTypeView>) {
        super(store);
    }

    //TODO: remove string because of sagittarius types update
    public getDataType = (type: DataTypeIdentifier): DataTypeView | undefined => {
        if ((type as DataTypeIdentifier).genericKey) return undefined
        const id = (type as DataTypeIdentifier).dataType?.identifier ?? (type as DataTypeIdentifier).genericType?.dataType?.identifier ?? (type as string)
        return this.values().find(value => value.id === id);
    }

    public getDataTypeFromValue = (value: NodeParameterValue): DataTypeView | undefined => {

        if (value.__typename == "LiteralValue") {
            //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
            if (typeof value.value === "string") return this.getDataType({dataType: {identifier: "TEXT"}})
            if (typeof value.value === "number") return this.getDataType({dataType: {identifier: "NUMBER"}})
            if (typeof value.value === "boolean") return this.getDataType({dataType: {identifier: "BOOLEAN"}})
            if (Array.isArray(value.value) && Array.from(value.value).length <= 0) return this.getDataType({dataType: {identifier: "ARRAY"}})
        }

        //TODO: performance here is bad
        const matchingDataTypes = this.values().filter(type => {
            if (type.identifier === "OBJECT") return false
            return useValidateValue(value, type)
        })

        // .sort((a, b) => {
        //     return a.depth - b.depth
        // })

        return matchingDataTypes[matchingDataTypes.length - 1]

    }

    public getTypeFromValue = (value: NodeParameterValue): Maybe<DataTypeIdentifier> | undefined => {

        if (value.__typename === "ReferenceValue") return value.dataTypeIdentifier

        const dataType = this.getDataTypeFromValue(value)
        if (!dataType?.genericKeys) return {dataType: {id: dataType?.id}}

        //TODO: missing generic combinations
        const genericMapper: any[] = dataType.genericKeys.map(genericKey => {

            const ruleThatIncludesGenericKey: Maybe<DataTypeRule> | undefined = dataType.rules?.nodes?.find((rule: DataTypeRule) => {
                // @ts-ignore
                return "dataTypeIdentifier" in (rule?.config ?? {}) && rule?.config?.dataTypeIdentifier?.genericKey
            })

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.variant === DataTypeRulesVariant.ContainsType
                && dataType.variant === DataTypeVariant.Array) {
                return {
                    types: [this.getTypeFromValue((value as Array<any>)[0])],
                    generic_target: genericKey
                }
            }

            /*

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.CONTAINS_TYPE
                && dataType.type === EDataType.ARRAY) {
                return {
                    types: [this.getTypeFromValue((value as Array<any>)[0])],
                    generic_target: genericKey
                }
            }

            //for object its not a rule
            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.CONTAINS_KEY
                && dataType.type === EDataType.OBJECT) {
                return {
                    types: [this.getTypeFromValue((value as Object)[(ruleThatIncludesGenericKey.config as DFlowDataTypeContainsKeyRuleConfig).key])],
                    generic_target: genericKey
                }
            }

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.RETURNS_TYPE
                && dataType.type === EDataType.NODE) {
                return {
                    types: [this.getTypeFromValue((value as NodeFunctionObject))],
                    generic_target: genericKey
                }
            }
            */

            return null
        }).filter(mapper => !!mapper)

        const resolvedType: DataTypeIdentifier = genericMapper ? {
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

    public hasDataTypes = (types: DataTypeIdentifier[]): boolean => {
        return types.every(type => {
            return this.values().find(value => {
                return value.id === (type.genericType?.dataType?.id ?? type.dataType?.id)
            })
        })
    }

}
