import {DFlowDataTypeRule, genericMapping, staticImplements} from "./DFlowDataTypeRule";
import {DFlowDataTypeReactiveService} from "../DFlowDataType.service";
import type {
    DataTypeRulesContainsKeyConfig,
    Flow,
    GenericMapper,
    LiteralValue,
    NodeParameterValue
} from "@code0-tech/sagittarius-graphql-types";
import {useValueValidation} from "../../d-flow-validation/DValueValidation.hook";


@staticImplements<DFlowDataTypeRule>()
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: NodeParameterValue, config: DataTypeRulesContainsKeyConfig, generics?: Map<string, GenericMapper>, flow?: Flow, dataTypeService?: DFlowDataTypeReactiveService): boolean {

        const genericMapper = generics?.get(config?.dataTypeIdentifier?.genericKey!!)
        const genericTypes = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.sourceDataTypeIdentifiers
        const genericCombination = generics?.get(config?.dataTypeIdentifier?.genericKey!!)?.genericCombinationStrategies

        //TODO: seperate general validation
        //if (!(isObject(value))) return false
        if ((config?.key ?? "") in value && config?.dataTypeIdentifier?.genericKey && !genericMapper && !dataTypeService?.getDataType(config.dataTypeIdentifier)) return true

        if (!(dataTypeService?.getDataType(config.dataTypeIdentifier!!) || genericMapper)) return false

        //use of generic key but datatypes does not exist
        if (genericMapper && !dataTypeService?.hasDataTypes(genericTypes!!)) return false

        //check if all generic combinations are set
        if (genericMapper && !(((genericCombination?.length ?? 0) + 1) == genericTypes!!.length)) return false

        //use generic given type for checking against value
        if (config?.dataTypeIdentifier?.genericKey && genericMapper && genericTypes) {
            const checkAllTypes: boolean[] = genericTypes.map(genericType => {
                return useValueValidation((value as LiteralValue).value[(config?.key ?? "")], dataTypeService?.getDataType(genericType)!!, dataTypeService!!, flow, ((genericType.genericType)!!.genericMappers as GenericMapper[]))
            })

            const combination = checkAllTypes.length > 1 ? checkAllTypes.reduce((previousValue, currentValue, currentIndex) => {
                if (genericCombination && genericCombination[currentIndex - 1].type == "OR") {
                    return previousValue || currentValue
                }

                return previousValue && currentValue
            }) : checkAllTypes[0]

            return ((config?.key ?? "") in value) && combination
        }

        //normal datatype link
        if (config?.dataTypeIdentifier?.dataType) {
            return ((config?.key ?? "") in value) && useValueValidation((value as LiteralValue).value[(config?.key ?? "")], dataTypeService?.getDataType(config.dataTypeIdentifier)!!, dataTypeService!!)
        }

        return ((config?.key ?? "") in value) && useValueValidation((value as LiteralValue).value[(config?.key ?? "")], dataTypeService?.getDataType(config.dataTypeIdentifier!!)!!, dataTypeService!!, flow, genericMapping(config?.dataTypeIdentifier?.genericType?.genericMappers!!, generics))
    }
}