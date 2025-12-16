import {ValidationResult} from "../../utils/inspection";
import type {Scalars} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils/contextStore";
import {DFlowReactiveService} from "../d-flow/DFlow.service";
import React from "react";

export const useDFlowValidations = (flowId: Scalars['FlowID']['output']): ValidationResult[] => {

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const flow = flowService.getById(flowId)

    //TODO: re-enable validations
    const validations = React.useMemo(() => {
        return [] //flow?.nodes?.nodes?.map(node => node?.parameters?.nodes?.map(parameter => parameter?.validationResults).flat() ?? []).flat() ?? []
    }, [flowStore])

    return validations

}