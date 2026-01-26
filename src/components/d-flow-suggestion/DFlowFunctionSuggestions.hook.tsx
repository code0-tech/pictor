import React from "react";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {isMatchingType, replaceGenericsAndSortType, resolveType} from "../../utils/generics";
import type {
    DataTypeIdentifier,
    LiteralValue,
    NodeFunction,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";

export const useFunctionSuggestions = (
    dataTypeIdentifier?: DataTypeIdentifier,
    genericKeys: string[] = []
): DFlowSuggestion[] => {
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)

    const dataType = React.useMemo(() => (
        dataTypeIdentifier ? dataTypeService?.getDataType(dataTypeIdentifier) : undefined
    ), [dataTypeIdentifier, dataTypeService, dataTypeStore])

    const resolvedType = React.useMemo(() => (
        dataTypeIdentifier ? replaceGenericsAndSortType(resolveType(dataTypeIdentifier, dataTypeService), genericKeys) : undefined
    ), [dataTypeIdentifier, dataTypeService, dataTypeStore, genericKeys])

    return React.useMemo(() => {
        const matchingFunctions = functionService.values().filter(funcDefinition => {
            if (!dataTypeIdentifier || !resolvedType) return true
            if (funcDefinition.runtimeFunctionDefinition?.identifier == "std::control::return") return false
            if (dataType?.variant === "NODE") return true
            if (!funcDefinition.returnType) return false
            if (!funcDefinition.genericKeys) return false
            const resolvedReturnType = replaceGenericsAndSortType(resolveType(funcDefinition.returnType, dataTypeService), funcDefinition.genericKeys)
            return isMatchingType(resolvedType, resolvedReturnType)
        }).sort((a, b) => {
            const [rA, pA, fA] = a.runtimeFunctionDefinition!!.identifier!!.split("::");
            const [rB, pB, fB] = b.runtimeFunctionDefinition!!.identifier!!.split("::");

            const runtimeCmp = rA.localeCompare(rB);
            if (runtimeCmp !== 0) return runtimeCmp;

            const packageCmp = pA.localeCompare(pB);
            if (packageCmp !== 0) return packageCmp;

            return fA.localeCompare(fB);
        })

        return matchingFunctions.map(funcDefinition => {
            const nodeFunctionSuggestion: LiteralValue | ReferenceValue | NodeFunction = {
                __typename: "NodeFunction",
                id: `gid://sagittarius/NodeFunction/1`,
                functionDefinition: {
                    id: funcDefinition.id,
                    runtimeFunctionDefinition: funcDefinition.runtimeFunctionDefinition
                },
                parameters: {
                    nodes: (funcDefinition.parameterDefinitions?.map((definition, index) => {
                        return {
                            id: `gid://sagittarius/NodeParameter/${index}`,
                            parameterDefinition: {
                                id: definition.id
                            }
                        }
                    }) ?? [])
                }
            }

            return {
                path: [],
                type: DFlowSuggestionType.FUNCTION,
                displayText: [funcDefinition.names!![0]?.content as string],
                value: nodeFunctionSuggestion,
            }
        })
    }, [dataType, dataTypeIdentifier, dataTypeService, functionService, functionStore, resolvedType, dataTypeStore])
}
