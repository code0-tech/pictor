import React from "react";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../../DFlow.edges.hook";
import Card from "../../../card/Card";

export interface DFlowFunctionGroupCardProps extends NodeProps<Node> {}

export const DFlowFunctionGroupCard: React.FC<DFlowFunctionGroupCardProps> = (
    {data, ...rest}
) => {
    const depth = (data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];
    return (
        <Card w={"100%"} h={"100%"}>
            <Handle
                type="source"
                position={Position.Top}
                className={"function-card__handle function-card__handle--target"}
                isConnectable={false}
                draggable={false}
                style={{top: "1rem"}}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className={"function-card__handle function-card__handle--target"}
                isConnectable={false}
                draggable={false}
                style={{bottom: "1rem"}}
            />
        </Card>
    );
};