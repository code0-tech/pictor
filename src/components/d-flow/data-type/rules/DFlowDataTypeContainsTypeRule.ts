import {DFlowDataTypeRule, staticImplements} from "./DFlowDataTypeRule";
import {EDataType, GenericMapper, GenericType, Type, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";
import {DFlowDataTypeContainsKeyRuleConfig} from "./DFlowDataTypeContainsKeyRule";

export interface DFlowDataTypeContainsTypeRuleConfig {
    type: Type
}

@staticImplements<DFlowDataTypeRule>(EDataType.ARRAY)
export class DFlowDataTypeContainsTypeRule {
    public static validate(value: Value, config: DFlowDataTypeContainsKeyRuleConfig, generics?: Map<string, Type>, service?: DFlowDataTypeService): boolean {
        if (!(Array.isArray(value))) return false

        if (!(service?.getDataType(config.type) || generics?.get(config.type as string))) return false

        //use of generic key but datatype does not exist
        if (generics?.get(config.type as string) && !service?.getDataType(generics?.get(config.type as string)!!)) return false

        if (generics?.get(config.type as string)) {
            return value.every(value1 => service?.getDataType(generics?.get(config.type as string)!!)?.validateValue(value1, ((generics?.get(config.type as string) as GenericType)!!.generic_mapper as GenericMapper[])))
        }

        //normal datatype link
        if (typeof config.type === "string") {
            return value.every(value1 => service?.getDataType(config.type)?.validateValue(value1))
        }

        //mapping generics to generic type
        const genericsMapper: GenericMapper[] | undefined = config.type.generic_mapper?.map(generic => {
            return {
                generic_target: generic.generic_target,
                type: generics?.get(generic.generic_target)!!
            }
        })

        return value.every(value1 => service?.getDataType(config.type)?.validateValue(value1, genericsMapper))

    }
}