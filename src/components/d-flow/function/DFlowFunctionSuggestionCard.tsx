import {Code0Component} from "../../../utils/types";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import React, {memo} from "react";
import {Button} from "../../button/Button";
import {IconPlus} from "@tabler/icons-react";
import {useSuggestions} from "../suggestion/DFlowSuggestion.hook";
import {useService} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {DFlowSuggestionMenu} from "../suggestion/DFlowSuggestionMenu";
import type {Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowFunctionSuggestionCardDataProps extends Code0Component<HTMLDivElement> {
    flowId: Flow['id']
    parentFunction?: NodeFunction
}

// @ts-ignore
export type DFlowFunctionSuggestionCardProps = NodeProps<Node<DFlowFunctionSuggestionCardDataProps>>

export const DFlowFunctionSuggestionCard: React.FC<DFlowFunctionSuggestionCardProps> = memo((props) => {

    const result = useSuggestions(undefined, [], props.data.flowId, 0, [0], 0)
    const flowService = useService(DFlowReactiveService)
    const flow = flowService.getById(props.data.flowId)

    return <DFlowSuggestionMenu onSuggestionSelect={suggestion => {
        if (props.data.parentFunction && suggestion.value.__typename === "NodeFunction") {
            flowService.addNextNodeById(flow?.id, props.data.parentFunction?.id, suggestion.value)
        } else if (flow && suggestion.value.__typename === "NodeFunction") {
            flowService.setStartingNodeById(flow?.id, suggestion.value)
        }
    }} suggestions={result} triggerContent={
        <Button paddingSize={"xxs"} variant={"normal"} color={"secondary"}>
            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                style={{top: "2px"}}
                position={Position.Top}
            />
            <IconPlus size={16}/>
        </Button>
    }/>

})