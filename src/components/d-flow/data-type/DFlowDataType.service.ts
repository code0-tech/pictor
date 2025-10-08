import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {
    DataTypeView,
    DataTypeRuleObject,
    EDataType,
    GenericMapper,
    isRefObject,
    Object,
    Type,
    Value
} from "./DFlowDataType.view";
import {DFlowDataTypeContainsKeyRuleConfig} from "./rules/DFlowDataTypeContainsKeyRule";
import {NodeFunctionObject} from "../DFlow.view";
import {EDataTypeRuleType} from "./rules/DFlowDataTypeRules";
import {resolveType} from "../../../utils/generics";
import {DataTypeIdentifier} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowDataTypeService {
    getDataType(type: DataTypeIdentifier | string): DataTypeView | undefined

    hasDataTypes(types: DataTypeIdentifier[]): boolean

    getDataTypeFromValue(value: Value): DataTypeView | undefined

    getTypeFromValue(value: Value): DataTypeIdentifier
}

export class DFlowDataTypeReactiveService extends ReactiveArrayService<DataTypeView> implements DFlowDataTypeService {

    constructor(store: ReactiveArrayStore<DataTypeView>) {
        super(store);
    }

    public getDataType = (type: DataTypeIdentifier | string): DataTypeView | undefined => {
        if (!!(type as DataTypeIdentifier).genericKey) return undefined
        const id = (type as DataTypeIdentifier).dataType?.identifier ?? (type as DataTypeIdentifier).genericType?.dataType.identifier ?? (type as string)
        return this.values().find(value => value.id === id);
    }

    public getDataTypeFromValue = (value: Value): DataTypeView | undefined => {

        //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
        if (typeof value === "string") return this.getDataType("TEXT")
        if (typeof value === "number") return this.getDataType("NUMBER")
        if (typeof value === "boolean") return this.getDataType("BOOLEAN")
        if (Array.isArray(value) && Array.from(value).length <= 0) return this.getDataType("ARRAY")

        //TODO: performance here is bad
        const matchingDataTypes = this.values().filter(type => {
            if (type.id === "OBJECT") return false
            return type.validateValue(value)
        }).sort((a, b) => {
            return a.depth - b.depth
        })

        return matchingDataTypes[matchingDataTypes.length - 1]

    }

    public getTypeFromValue = (value: Value): Type => {

        if (isRefObject(value)) return value.type

        const dataType = this.getDataTypeFromValue(value)
        if (!dataType?.genericKeys) return dataType?.id ?? ""

        //TODO: missing generic combinations
        const genericMapper: GenericMapper[] = dataType.genericKeys.map(genericKey => {

            const ruleThatIncludesGenericKey = dataType.rules.find((rule: DataTypeRuleObject) => {
                return "type" in rule.config && rule.config.type === genericKey
            })

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
            return null
        }).filter(mapper => !!mapper)

        return resolveType({
            type: dataType?.id ?? "",
            generic_mapper: genericMapper
        }, this)

    }

    public hasDataTypes = (types: Type[]): boolean => {
        return types.every(type => {
            return this.values().find(value => value.id === (typeof type === "string" ? type : type.type))
        })
    }

}
