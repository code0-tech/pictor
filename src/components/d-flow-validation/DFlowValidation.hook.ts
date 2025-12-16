import {ValidationResult} from "../../utils";
import type {Flow} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import React from "react";

export const useFlowValidation = (flowId: Flow['id']): ValidationResult[] => {

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const flow = flowService.getById(flowId)

    //TODO: re-enable validations
    const validations = React.useMemo(() => {
        return [] //flow?.nodes?.nodes?.map(node => node?.parameters?.nodes?.map(parameter => parameter?.validationResults).flat() ?? []).flat() ?? []
    }, [flowStore])

    return validations

}