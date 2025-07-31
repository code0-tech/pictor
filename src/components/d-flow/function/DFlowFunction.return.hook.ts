import {FunctionDefinition} from "./DFlowFunction.view";
import {Type, Value} from "../data-type/DFlowDataType.view";
import {DFlowDataTypeReactiveService, DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {replaceGenericKeysInType, resolveGenericKeys} from "../../../utils/generics";
import {useService} from "../../../utils/contextStore";

export const useReturnType = (
    func: FunctionDefinition,
    values: Value[],
    dataTypeService?: DFlowDataTypeService
): Type | null => {

    dataTypeService = dataTypeService ?? useService(DFlowDataTypeReactiveService)

    if (!func.return_type) return null

    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    return replaceGenericKeysInType(func.return_type, genericTypeMap)

}