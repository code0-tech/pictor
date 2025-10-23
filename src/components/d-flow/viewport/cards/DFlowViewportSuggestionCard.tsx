import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import React, {memo} from "react";
import Button from "../../../button/Button";
import {IconPlus} from "@tabler/icons-react";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {NodeFunctionView} from "../../DFlow.view";
import {useService} from "../../../../utils/contextStore";
import {DFlowReactiveService} from "../../DFlow.service";
import {DFlowSuggestionMenu} from "../../suggestions/DFlowSuggestionMenu";
import {NodeFunction} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowViewportSuggestionCardDataProps extends Code0Component<HTMLDivElement> {
    flowId: string
    parentFunction: NodeFunctionView
}

// @ts-ignore
export type DFlowViewportSuggestionCardProps = NodeProps<Node<DFlowViewportSuggestionCardDataProps>>

export const DFlowViewportSuggestionCard: React.FC<DFlowViewportSuggestionCardProps> = memo((props) => {

    const result = useSuggestions(undefined, [], props.data.flowId, 0, [0], 0)
    const flowService = useService(DFlowReactiveService)
    const flow = flowService.getById(props.data.flowId)

    return <DFlowSuggestionMenu onSuggestionSelect={suggestion => {
        const nodeFunction = new NodeFunctionView(suggestion.value as NodeFunction)
        props.data.parentFunction.nextNodeId = nodeFunction.id!!
        flow?.addNode(nodeFunction)
        flowService.update()
    }} suggestions={result} triggerContent={
        <Button top={0} variant={"normal"} color={"secondary"}>
            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                style={{top: "2px"}}
                position={Position.Top}
            />
            <IconPlus size={16}/>
            Add next
        </Button>
    }/>

})