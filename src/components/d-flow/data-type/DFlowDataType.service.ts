import {ReactiveArrayStore, ReactiveArrayService} from "../../../utils/reactiveArrayService";
import {
    DataType,
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

export interface DFlowDataTypeService {
    getDataType(type: Type): DataType | undefined

    hasDataTypes(types: Type[]): boolean

    getDataTypeFromValue(value: Value): DataType | undefined

    getTypeFromValue(value: Value): Type
}

export class DFlowDataTypeReactiveService extends ReactiveArrayService<DataType> implements DFlowDataTypeService {

    constructor(store: ReactiveArrayStore<DataType>) {
        super(store);
    }

    public getDataType = (type: Type): DataType | undefined => {
        return this.values().find(value => value.id === (typeof type === "string" ? type : (type?.type ?? "")));
    }

    public getDataTypeFromValue = (value: Value): DataType | undefined => {

        //hardcode primitive types (NUMBER, BOOLEAN, TEXT)
        if (typeof value === "string") return this.getDataType("TEXT")
        if (typeof value === "number") return this.getDataType("NUMBER")
        if (typeof value === "boolean") return this.getDataType("BOOLEAN")

        const matchingDataTypes = this.values().filter(type => {
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

            if (ruleThatIncludesGenericKey
                && ruleThatIncludesGenericKey.type === EDataTypeRuleType.CONTAINS_TYPE
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

        return {
            type: dataType?.id ?? "",
            generic_mapper: genericMapper
        }

    }

    public hasDataTypes = (types: Type[]): boolean => {
        return types.every(type => {
            return this.values().find(value => value.id === (typeof type === "string" ? type : type.type))
        })
    }

}
