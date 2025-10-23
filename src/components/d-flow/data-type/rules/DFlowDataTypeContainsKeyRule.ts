import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {
    DataTypeRulesContainsKeyConfig,
    GenericCombinationStrategyType,
    GenericMapper, LiteralValue,
    NodeParameterValue
} from "@code0-tech/sagittarius-graphql-types";


@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesContainsKeyConfig, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sourceDataTypeIdentifiers
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        //TODO: seperate general validation
        //if (!(isObject(value))) return false
        if ((config?.key ?? "") in value && config?.dataTypeIdentifier?.genericKey && !genericMapper && !service?.getDataType(config.dataTypeIdentifier)) return true

        if (!(service?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatypes does not exist
        if (genericMapper && !service?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        //use generic given type for checking against value
        if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {
            const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                return !!service?.getDataType(genericType)?.validateValue((value as LiteralValue).value[(config?.key ?? "")], ((genericType.genericType)!!.genericMappers as GenericMapper[]))
            })

            const combination = checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                if (genericCombination && genericCombination[currentIndex - 1].type == GenericCombinationStrategyType.Or) {
                    return previousValue || currentValue
                }

                return previousValue && currentValue
            }) : checkAllTypes[0]

            return ((config?.key ?? "") in value) && combination
        }

        //normal datatype link
        if (config?.dataTypeIdentifier?.dataType) {
            return ((config?.key ?? "") in value) && (!!service?.getDataType(config.dataTypeIdentifier)?.validateValue((value as LiteralValue).value[(config?.key ?? "")]))
        }

        return ((config?.key ?? "") in value) && (!!service?.getDataType(config.dataTypeIdentifier!!)?.validateValue((value as LiteralValue).value[(config?.key ?? "")], genericMapping(config?.dataTypeIdentifier?.genericType?.genericMappers!!, generics)))
    }
}