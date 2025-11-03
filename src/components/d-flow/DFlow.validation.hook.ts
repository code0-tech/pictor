import {ValidationResult} from "../../utils/inspection";
import {Scalars} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils/contextStore";
import {DFlowReactiveService} from "./DFlow.service";
import React from "react";

export const useDFlowValidations = (flowId: Scalars['FlowID']['output']): ValidationResult[] => {

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const flow = flowService.getById(flowId)

    const validations = React.useMemo(() => {
        return flow?.nodes?.map(node => node.parameters?.map(parameter => parameter.validationResults).flat() ?? []).flat() ?? []
    }, [flowStore])

    return validations

}