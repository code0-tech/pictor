import {FunctionDefinition} from "./DFlowFunction.view";
import {Type, Value} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {replaceGenericKeysInType, resolveGenericKeys} from "../../../utils/generics";

export const useInputType = (
    type: Type,
    func: FunctionDefinition,
    values: Value[],
    dataTypeService: DFlowDataTypeService
): Type | null => {

    if (!func.return_type) return null

    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    return replaceGenericKeysInType(type, genericTypeMap)

}