import {Code0Component} from "../../../../utils/types";
import {Node, NodeProps} from "@xyflow/react";
import React, {memo} from "react";
import Button from "../../../button/Button";
import {IconPlus} from "@tabler/icons-react";
import {useSuggestions} from "../../suggestions/DFlowSuggestion.hook";
import {NodeFunction, NodeFunctionObject} from "../../DFlow.view";
import {useService} from "../../../../utils/contextStore";
import {DFlowReactiveService} from "../../DFlow.service";
import {DFlowSuggestionMenu} from "../../suggestions/DFlowSuggestionMenu";

export interface DFlowViewportSuggestionCardDataProps extends Code0Component<HTMLDivElement> {
    flowId: string
    parentFunction: NodeFunction
}

// @ts-ignore
export type DFlowViewportSuggestionCardProps = NodeProps<Node<DFlowViewportSuggestionCardDataProps>>

export const DFlowViewportSuggestionCard: React.FC<DFlowViewportSuggestionCardProps> = memo((props) => {

    const result = useSuggestions(undefined, [], props.data.flowId, 0, 0)
    const flowService = useService(DFlowReactiveService)

    return <DFlowSuggestionMenu onSuggestionSelect={suggestion => {
        props.data.parentFunction.nextNode = new NodeFunction(suggestion.value as NodeFunctionObject)
        flowService.update()
    }} suggestions={result} triggerContent={<Button top={-50} variant={"normal"} color={"secondary"}><IconPlus size={16}/> Add new node</Button>}/>

})