import {FunctionDefinitionView} from "./DFlowFunction.view";
import {DFlowDataTypeService} from "../data-type/DFlowDataType.service";
import {replaceGenericKeysInType, resolveGenericKeys} from "../../../utils/generics";
import {DataTypeIdentifier, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";

export const useInputType = (
    type: DataTypeIdentifier,
    func: FunctionDefinitionView,
    values: NodeParameterValue[],
    dataTypeService: DFlowDataTypeService
): DataTypeIdentifier | null => {

    if (!func.return_type) return null

    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService)
    return replaceGenericKeysInType(type, genericTypeMap)

}