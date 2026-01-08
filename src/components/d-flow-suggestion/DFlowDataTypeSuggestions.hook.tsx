import React from "react";
import {useService, useStore} from "../../utils";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowSuggestion, DFlowSuggestionType} from "./DFlowSuggestion.view";
import type {DataTypeIdentifier} from "@code0-tech/sagittarius-graphql-types";

export const useDataTypeSuggestions = (dataTypeIdentifier?: DataTypeIdentifier): DFlowSuggestion[] => {
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)

    const dataType = React.useMemo(() => (
        dataTypeIdentifier ? dataTypeService?.getDataType(dataTypeIdentifier) : undefined
    ), [dataTypeIdentifier, dataTypeService, dataTypeStore])

    // @ts-ignore
    return React.useMemo(() => {
        if (!dataType || dataType.variant !== "DATA_TYPE") return []

        return dataTypeService.values().map(nextDataType => ({
            path: [],
            type: DFlowSuggestionType.DATA_TYPE,
            displayText: [nextDataType.name!![0]?.content!],
            /*@ts-ignore*/
            value: nextDataType.json,
        }))
    }, [dataType, dataTypeService, dataTypeStore])
}
