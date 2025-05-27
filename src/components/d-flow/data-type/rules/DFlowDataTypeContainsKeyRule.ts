import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, GenericMapper, GenericType, isObject, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeContainsKeyRuleConfig {
    key: string
    type: Type
}

@staticImplements<DFlowDataTypeRule>(EDataType.OBJECT)
export class DFlowDataTypeContainsKeyRule {
    public static validate(value: Value, config: DFlowDataTypeContainsKeyRuleConfig, generics?: Map<string, Type>, service?: DFlowDataTypeService): boolean {
        if (!(isObject(value))) return false

        if (!(service?.getDataType(config.type) || generics?.get(config.type as string))) return false

        //use of generic key but datatype does not exist
        if (generics?.get(config.type as string) && !service?.getDataType(generics?.get(config.type as string)!!)) return false

        //use generic given type for checking against value
        if (generics?.get(config.type as string)) {
            return (config.key in value) && (!!service?.getDataType(generics?.get(config.type as string)!!)?.validateValue(value[config.key], ((generics?.get(config.type as string) as GenericType)!!.generic_mapper as GenericMapper[])))
        }

        //normal datatype link
        if (typeof config.type === "string") {
            return (config.key in value) && (!!service?.getDataType(config.type)?.validateValue(value[config.key]))
        }

        //mapping generics to generic type
        const genericsMapper: GenericMapper[] | undefined = config.type.generic_mapper?.map(generic => {
            return {
                generic_target: generic.generic_target,
                type: generics?.get(generic.generic_target)!!
            }
        })

        return (config.key in value) && (!!service?.getDataType(config.type)?.validateValue(value[config.key], genericsMapper))
    }
}