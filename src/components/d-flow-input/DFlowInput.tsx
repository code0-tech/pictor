import {Flow, NodeFunction, NodeParameter} from "@code0-tech/sagittarius-graphql-types";
import React from "react";
import {InputProps} from "../form";
import {DFlowInputDefault} from "./DFlowInputDefault";
import {useService, useStore} from "../../utils";
import {DFlowReactiveService} from "../d-flow";
import {DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowFunctionReactiveService} from "../d-flow-function";
import {DFlowInputObject} from "./DFlowInputObject";

export interface DFlowInputProps extends Omit<InputProps<any | null>, "wrapperComponent" | "type"> {
    flowId: Flow['id']
    nodeId: NodeFunction['id']
    parameterId: NodeParameter['id']
    clearable?: boolean
    onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const DFlowInput: React.FC<DFlowInputProps> = (props) => {

    const {flowId, nodeId, parameterId, ...rest} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const dataTypeService = useService(DFlowDataTypeReactiveService)
    const dataTypeStore = useStore(DFlowDataTypeReactiveService)
    const functionService = useService(DFlowFunctionReactiveService)
    const functionStore = useStore(DFlowFunctionReactiveService)

    const node = React.useMemo(
        () => flowService.getNodeById(flowId, nodeId),
        [flowStore, flowId, nodeId]
    )

    const parameter = React.useMemo(
        () => node?.parameters?.nodes?.find(p => p?.id === parameterId),
        [node, parameterId]
    )

    const functionDefinition = React.useMemo(
        () => functionService.getById(node?.functionDefinition?.id!),
        [functionStore, node]
    )

    const parameterDefinition = React.useMemo(
        () => functionDefinition?.parameterDefinitions?.find(pd => pd.id === parameter?.parameterDefinition?.id),
        [functionDefinition, parameter]
    )

    const dataType = React.useMemo(
        () => dataTypeService.getDataType(parameterDefinition?.dataTypeIdentifier!),
        [dataTypeStore, parameterDefinition]
    )

    switch (dataType?.variant) {
        case "ARRAY":
        case "OBJECT":
            return <DFlowInputObject
                flowId={flowId}
                nodeId={nodeId}
                parameterId={parameterId}
                {...rest}
            />
        default:
            return <DFlowInputDefault
                flowId={flowId}
                nodeId={nodeId}
                parameterId={parameterId}
                {...rest}
            />
    }
}