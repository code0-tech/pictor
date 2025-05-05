import {EDataType, Values} from "../DFlowDataType.view";
import {DFlowDataTypeService} from "../DFlowDataType.service";

export interface DFlowDataTypeRule {
    validate(value: Values, config: object, service: DFlowDataTypeService): boolean
}

export const staticImplements = <T>(...types: EDataType[]) => {
    return <U extends T>(constructor: U) => constructor
}