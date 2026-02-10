import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeReactiveService} from "../DFlowDataType.service";
import type {
    DataTypeRulesContainsKeyConfig,
    Flow,
    GenericMapper,
    GenericType,
    LiteralValue,
    NodeParameterValue
} from "@code0-tech/sagittarius-graphql-types";
import {useValueValidation} from "../../d-flow-validation/DValueValidation.hook";

@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeContainsTypeRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesContainsKeyConfig, generics?: Map<string, GenericMapper>, flow?: Flow, dataTypeService?: DFlowDataTypeReactiveService): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sourceDataTypeIdentifiers
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        //TODO: seperate general validation
        if ("value" in value && !(Array.isArray(value.value))) return false

        if (config?.dataTypeIdentifier?.genericKey && !genericMapper && !dataTypeService?.getDataType(config.dataTypeIdentifier)) return true

        if (!(dataTypeService?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatype does not exist
        if (genericMapper && !dataTypeService?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        //use generic given type for checking against value
        if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {
            const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                return (value as LiteralValue).value.every((value1: any) => {
                    if (genericType.genericType) {
                        return useValueValidation({
                            __typename: "LiteralValue",
                            value: value1
                        }, dataTypeService?.getDataType(genericType)!!, dataTypeService!!, flow, ((genericType.genericType as GenericType)!!.genericMappers as GenericMapper[]))
                    }
                    return useValueValidation({
                        __typename: "LiteralValue",
                        value: value1
                    }, dataTypeService?.getDataType(genericType)!!, dataTypeService!!, flow)
                })
            })

            return checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                if (genericCombination && genericCombination[currentIndex - 1].type == "OR") {
                    return previousValue || currentValue
                }

                return previousValue && currentValue
            }) : checkAllTypes[0]
        }

        //normal datatype link
        if (config?.dataTypeIdentifier?.dataType) {
            return (value as LiteralValue).value.every((value1: any) => useValueValidation(value1, dataTypeService?.getDataType(config.dataTypeIdentifier!!)!!, dataTypeService!!))
        }

        return (value as LiteralValue).value.every((value1: any) => useValueValidation(value1, dataTypeService?.getDataType(config.dataTypeIdentifier!!)!!, dataTypeService!!, flow, genericMapping((config.dataTypeIdentifier?.genericType as GenericType).genericMappers!!, generics)))

    }
}