import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import {NodeFunctionObject, NodeParameterObject} from "../../DFlow.view";
import React, {memo} from "react";
import Card from "../../../card/Card";
import "./DFlowFunctionCard.style.scss";

type CodeZeroComponentProps = Code0Component<HTMLDivElement>;

// @ts-ignore
export interface DFlowFunctionCardProps extends NodeProps<Node<CodeZeroComponentProps & NodeFunctionObject>> {}

export const DFlowFunctionCard: React.FC<DFlowFunctionCardProps> = memo((props) => {
    const {data, id} = props;
    const functionData = data as NodeFunctionObject & { isParameter: boolean };

    const viewportWidth = useStore(s => s.width);
    const viewportHeight = useStore(s => s.height);
    const flowInstance = useReactFlow()

    // Greife auf alle aktuellen Edges im Flow zu:
    const edges = useStore(s => s.edges);

    // Helper, ob zu diesem Parameter eine Edge existiert:
    function isParamConnected(paramId: string): boolean {
        return edges.some(e =>
            e.target === id &&
            e.targetHandle === `param-${paramId}`
        );
    }

    return (
        <Card w={300} color={"secondary"} onClick={() => {
            console.log("sdsdsdsdd")
            flowInstance.setViewport({
                x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - 150,
                y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - 50,
                zoom: 1
            }, {
                duration: 250,
            })
        }} style={{position: "relative"}}>
            {/* Oben globaler Eingang */}
            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"function-card__handle function-card__handle--target"}
                position={Position.Top}
            />

            My favorite UX feedback from customers is:
            "How is the app so fast?" Because we’ve built on Next.js and Vercel since day one,
            our pages load in an instant, which is important when it comes to mission-critical software.

            {/* Dynamische Parameter-Eingänge (rechts), nur wenn wirklich verbunden */}
            {functionData.parameters?.map((param: NodeParameterObject, index: number) => (
                <Handle
                    key={param.definition.parameter_id}
                    type="target"
                    position={Position.Right}
                    id={`param-${param.definition.parameter_id}`}
                    style={{top: 50 + index * 30}}
                    isConnectable={false}
                    hidden={!isParamConnected(param.definition.parameter_id)}
                    className={"function-card__handle function-card__handle--target"}
                />
            ))}

            {/* Ausgang */}
            <Handle
                isConnectable={false}
                type="source"
                className={"function-card__handle function-card__handle--source"}
                position={functionData.isParameter ? Position.Left : Position.Bottom}
            />
        </Card>
    );
});