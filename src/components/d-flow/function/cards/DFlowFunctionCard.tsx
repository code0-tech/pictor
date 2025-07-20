import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {NodeFunctionObject, NodeParameterObject} from "../../DFlow.view";
import React, {memo} from "react";
import Card from "../../../card/Card";
import "./DFlowFunctionCard.style.scss"

type CodeZeroComponentProps = Code0Component<HTMLDivElement>;

// @ts-ignore
export interface DFlowFunctionCardProps extends NodeProps<Node<CodeZeroComponentProps & NodeFunctionObject>> {
}

export const DFlowFunctionCard: React.FC<DFlowFunctionCardProps> = memo((props) => {

    const {data} = props;
    const functionData = data as NodeFunctionObject & { isParameter: boolean };

    return (
        <Card w={300} color={"secondary"} style={{position: "relative"}}>
            {/* Oben globaler Eingang */}
            <Handle isConnectable={false}
                    draggable={false}
                    type="target"
                    position={Position.Top}/>

            My favorite UX feedback from customers is:
            "How is the app so fast?" Because we’ve built on Next.js and Vercel since day one,
            our pages load in an instant, which is important when it comes to mission-critical software.

            {/* Dynamische Parameter-Eingänge (links) */}
            {functionData.parameters?.map((param: NodeParameterObject, index: number) => (
                <Handle
                    key={param.definition.parameter_id}
                    type="target"
                    position={Position.Right}
                    id={`param-${param.definition.parameter_id}`}
                    style={{top: 50 + index * 30}}
                    isConnectable={false}
                />
            ))}

            {/* Ausgang */}
            <Handle isConnectable={false}
                    type="source"
                    position={functionData.isParameter ? Position.Left : Position.Bottom}/>
        </Card>
    )
})