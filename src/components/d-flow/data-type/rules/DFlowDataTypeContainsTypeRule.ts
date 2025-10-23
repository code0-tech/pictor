import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {
    DataTypeRulesContainsKeyConfig, GenericCombinationStrategyType,
    GenericMapper, GenericType,
    LiteralValue,
    NodeParameterValue
} from "@code0-tech/sagittarius-graphql-types";
import {useValidateValue} from "../DFlowDataType.validation.value";

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeContainsTypeRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesContainsKeyConfig, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sourceDataTypeIdentifiers
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        //TODO: seperate general validation
        //if (!(Array.isArray(value))) return false

        //TODO: only if its really a generic key
        if (config?.dataTypeIdentifier?.genericKey && !genericMapper && !service?.getDataType(config.dataTypeIdentifier)) return true

        if (!(service?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatype does not exist
        if (genericMapper && !service?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        //use generic given type for checking against value
        if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {
            const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                return (value as LiteralValue).value.every((value1: any) => {
                    return useValidateValue(value1, service?.getDataType(genericType)!!, ((genericType.genericType as GenericType)!!.genericMappers as GenericMapper[]))
                })
            })

            return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                if (genericCombination && genericCombination[currentIndex - 1].type == GenericCombinationStrategyType.Or) {
                    return previousValue || currentValue
                }

                return previousValue && currentValue
            }) : checkAllTypes[0]
        }

        //normal datatype link
        if (config?.dataTypeIdentifier?.dataType) {
            return (value as LiteralValue).value.every((value1: any) => useValidateValue(value1, service?.getDataType(config.dataTypeIdentifier!!)!!))
        }

        return (value as LiteralValue).value.every((value1: any) => useValidateValue(value1, service?.getDataType(config.dataTypeIdentifier!!)!!, genericMapping((config.dataTypeIdentifier?.genericType as GenericType).genericMappers!!, generics)))

    }
}