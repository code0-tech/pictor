import {Code0Component} from "../../../../utils/types";
import {Handle, Node, NodeProps, Position, useReactFlow, useStore} from "@xyflow/react";
import {NodeFunctionObject, NodeParameterObject} from "../../DFlow.view";
import React, {memo} from "react";
import Card from "../../../card/Card";
import "./DFlowFunctionCard.style.scss";
import CardSection from "../../../card/CardSection";
import Flex from "../../../flex/Flex";
import Button from "../../../button/Button";
import {IconFileLambdaFilled} from "@tabler/icons-react";
import Text from "../../../text/Text";

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
            flowInstance.setViewport({
                x: (viewportWidth / 2) + (props.positionAbsoluteX * -1) - 150,
                y: (viewportHeight / 2) + (props.positionAbsoluteY * -1) - 50,
                zoom: 1
            }, {
                duration: 250,
            })
        }} style={{position: "relative"}}>

            <CardSection border>
                <Flex align={"center"} style={{gap: "0.7rem"}}>
                    <IconFileLambdaFilled size={16}/>
                    <Text size={"md"}>{functionData.function.function_id}</Text>
                </Flex>
            </CardSection>

            <Handle
                isConnectable={false}
                draggable={false}
                type="target"
                className={"function-card__handle function-card__handle--target"}
                position={Position.Top}
            />

            {/* Dynamische Parameter-Eingänge (rechts), nur wenn wirklich verbunden */}
            {functionData.parameters?.map((param: NodeParameterObject, index: number) => (
                <div>
                    {param.definition.parameter_id}
                    <Handle
                        key={param.definition.parameter_id}
                        type="target"
                        position={Position.Right}
                        style={{position: "absolute", transform: "translateX(50%)", top: "auto", right: 0}}
                        id={`param-${param.definition.parameter_id}`}
                        isConnectable={false}
                        hidden={!isParamConnected(param.definition.parameter_id)}
                        className={"function-card__handle function-card__handle--target"}
                    />
                </div>
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