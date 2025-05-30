import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, GenericCombinationStrategy, GenericMapper, GenericType, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {DFlowDataTypeContainsKeyRuleConfig} from "./DFlowDataTypeContainsKeyRule";

export interface DFlowDataTypeContainsTypeRuleConfig {
    type: Type
}

@staticImplements<DFlowDataTypeRule>(EDataType.ARRAY)
export class DFlowDataTypeContainsTypeRule {
    public static validate(value: Value, config: DFlowDataTypeContainsKeyRuleConfig, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean {

        const genericMapper = generics?.get(config.type as string)
        const genericTypes = generics?.get(config.type as string)?.types
        const genericCombination = generics?.get(config.type as string)?.generic_combination

        if (!(Array.isArray(value))) return false

        if (!(service?.getDataType(config.type) || genericMapper)) return false

        //use of generic key but datatype does not exist
        if (genericMapper && !service?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        //use generic given type for checking against value
        if (typeof config.type === "string" && genericMapper && genericTypes) {
            const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                return value.every(value1 => {
                    return service?.getDataType(genericType)?.validateValue(value1, ((genericType as GenericType)!!.generic_mapper as GenericMapper[]))
                })
            })

            return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                if (genericCombination && genericCombination[currentIndex - 1] == GenericCombinationStrategy.OR) {
                    return previousValue || currentValue
                }

                return previousValue && currentValue
            }) : checkAllTypes[0]
        }

        //normal datatype link
        if (typeof config.type === "string") {
            return value.every(value1 => service?.getDataType(config.type)?.validateValue(value1))
        }

        return value.every(value1 => service?.getDataType(config.type)?.validateValue(value1, genericMapping((config.type as GenericType).generic_mapper, generics)))

    }
}