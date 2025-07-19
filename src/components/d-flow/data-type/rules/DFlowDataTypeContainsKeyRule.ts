import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {
    GenericCombinationStrategy,
    GenericMapper,
    GenericType,
    isObject,
    Type,
    Value
} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsKeyRuleConfig {
    key: string
    type: Type
}

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: Value, config: DFlowDataTypeContainsKeyRuleConfig, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean {

        const genericMapper = generics?.get(config.type as string)
        const genericTypes = generics?.get(config.type as string)?.types
        const genericCombination = generics?.get(config.type as string)?.generic_combination

        if (!(isObject(value))) return false

        //TODO: only if its really a generic key
        if (config.key in value && typeof config.type === "string" && !genericMapper && !service?.getDataType(config.type)) return true

        if (!(service?.getDataType(config.type) || genericMapper)) return false

        //use of generic key but datatypes does not exist
        if (genericMapper && !service?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        //use generic given type for checking against value
        if (typeof config.type === "string" && genericMapper && genericTypes) {
            const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                return !!service?.getDataType(genericType)?.validateValue(value[config.key], ((genericType as GenericType)!!.generic_mapper as GenericMapper[]))
            })

            const combination = checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                if (genericCombination && genericCombination[currentIndex - 1] == GenericCombinationStrategy.OR) {
                    return previousValue || currentValue
                }

                return previousValue && currentValue
            }) : checkAllTypes[0]

            return (config.key in value) && combination
        }

        //normal datatype link
        if (typeof config.type === "string") {
            return (config.key in value) && (!!service?.getDataType(config.type)?.validateValue(value[config.key]))
        }

        return (config.key in value) && (!!service?.getDataType(config.type)?.validateValue(value[config.key], genericMapping(config.type.generic_mapper, generics)))
    }
}