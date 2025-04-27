import {EDataType, RawDataTypes} from "../DFlowDataType.view";

export interface DFlowDataTypeRule {
    validate(value: RawDataTypes, config: object): boolean
}

export const staticImplements = <T>(...types: EDataType[]) => {
    return <U extends T>(constructor: U) => constructor
}
