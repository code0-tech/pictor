import {Code0Component, useService} from "../../utils";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import React, {memo} from "react";
import {Button} from "../button/Button";
import {IconPlus} from "@tabler/icons-react";
import {useSuggestions} from "../d-flow-suggestion/DFlowSuggestion.hook";
import {DFlowReactiveService} from "../d-flow";
import {DFlowSuggestionMenu} from "../d-flow-suggestion/DFlowSuggestionMenu";
import type {Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowFunctionSuggestionCardDataProps extends Code0Component<HTMLDivElement> {
    flowId: Flow['id']
    parentFunction?: NodeFunction
}

// @ts-ignore
export type DFlowFunctionSuggestionCardProps = NodeProps<Node<DFlowFunctionSuggestionCardDataProps>>

export const DFlowFunctionSuggestionCard: React.FC<DFlowFunctionSuggestionCardProps> = memo((props) => {

    const [, startTransition] = React.useTransition()
    const result = useSuggestions(props.data.flowId, props.data.parentFunction?.id)
    const flowService = useService(DFlowReactiveService)
    const flow = flowService.getById(props.data.flowId)

    return <DFlowSuggestionMenu onSuggestionSelect={suggestion => {
        startTransition(async () => {
            if (suggestion.value.__typename === "NodeFunction") {
                await flowService.addNextNodeById(flow?.id, props.data.parentFunction?.id ?? null, suggestion.value)
            }
        })
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
            <IconPlus size={12}/>
        </Button>
    }/>

})
