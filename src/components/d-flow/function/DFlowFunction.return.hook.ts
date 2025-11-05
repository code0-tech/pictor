import {FunctionDefinitionView} from "./DFlowFunction.view";
import {DFlowDataTypeReactiveService} from "../data-type/DFlowDataType.service";
import {replaceGenericKeysInType, resolveGenericKeys} from "../../../utils/generics";
import {useService} from "../../../utils/contextStore";
import {DataTypeIdentifier, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

export const useReturnType = (
    func: FunctionDefinitionView,
    values: NodeParameterValue[],
    dataTypeService?: DFlowDataTypeReactiveService
): DataTypeIdentifier | null => {

    dataTypeService = dataTypeService ?? useService(DFlowDataTypeReactiveService)

    if (!func.returnType) return null

    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    return replaceGenericKeysInType(func.returnType, genericTypeMap)

}