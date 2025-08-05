import React from "react";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../../DFlow.edges.hook";
import Card from "../../../card/Card";

export interface DFlowFunctionGroupCardProps extends NodeProps<Node> {}

export const DFlowFunctionGroupCard: React.FC<DFlowFunctionGroupCardProps> = (
    {data, ...rest}
) => {
    //console.log(data, rest)
    const depth = (data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];
    return (
        <Card w={"100%"} h={"100%"}>
            <Handle
                type="source"
                position={Position.Top}
                className="function-group__handle"
                isConnectable={false}
            />
        </Card>
    );
};