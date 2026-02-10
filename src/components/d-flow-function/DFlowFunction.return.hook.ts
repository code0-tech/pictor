import {FunctionDefinitionView} from "./DFlowFunction.view";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {replaceGenericKeysInType, resolveGenericKeys} from "../../utils/generics";
import type {DataTypeIdentifier, NodeParameterValue} from "@code0-tech/sagittarius-graphql-types";
import {DFlowFunctionReactiveService} from "./DFlowFunction.service";

export const useReturnType = (
    func: FunctionDefinitionView,
    values: NodeParameterValue[],
    dataTypeService: DFlowDataTypeReactiveService,
    functionService: DFlowFunctionReactiveService,
): DataTypeIdentifier | null => {

    if (!func?.returnType) return null

    const genericTypeMap = resolveGenericKeys(func, values, dataTypeService, functionService)
    return replaceGenericKeysInType(func.returnType, genericTypeMap)

}