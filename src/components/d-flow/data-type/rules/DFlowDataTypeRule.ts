import {EDataType, GenericMapper, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeRule {
    validate(value: Value, config: object, generics?: Map<string, GenericMapper>, service?: DFlowDataTypeService): boolean
}

export const staticImplements = <T>(...types: EDataType[]) => {
    return <U extends T>(constructor: U) => constructor
}

export const genericMapping = (to?: GenericMapper[], from?: Map<string, GenericMapper>): GenericMapper[] | undefined => {

    if (!to || !from) return []

    return to.map(generic => {
        return {
            types: generic.types.map(type => from?.get(type as string)?.types!!).flat(),
            generic_target: generic.generic_target,
            generic_combination: generic.types.map(type => from?.get(type as string)?.generic_combination!!).flat()
        }
    })
}