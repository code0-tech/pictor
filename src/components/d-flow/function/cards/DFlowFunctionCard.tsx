import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {NodeFunctionObject} from "../../DFlow.view";
import React, {memo} from "react";
import Card from "../../../card/Card";

type CodeZeroComponentProps = Code0Component<HTMLDivElement>

// @ts-ignore
export interface DFlowFunctionCardProps extends NodeProps<Node<CodeZeroComponentProps & NodeFunctionObject>> {

}

export const DFlowFunctionCard: React.FC<DFlowFunctionCardProps> = memo((props) => {

    const {data} = props

    return <Card w={300} color={"secondary"}>
        <Handle isConnectable={false} draggable={false} type="target" position={Position.Top}/>
        My favorite UX feedback from customers is:
        "How is the app so fast?"
        Because we’ve built on Next.js and Vercel since day one, our pages load in an instant,
        which is important when it comes to mission-critical software.
        <Handle isConnectable={false} type="source" position={Position.Bottom}/>
    </Card>

})