import {EDataType, GenericTypeMapper, Value} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeRule {
    validate(value: Value, config: object, generics?: Map<string, string>, service?: DFlowDataTypeService): boolean
}

export const staticImplements = <T>(...types: EDataType[]) => {
    return <U extends T>(constructor: U) => constructor
}