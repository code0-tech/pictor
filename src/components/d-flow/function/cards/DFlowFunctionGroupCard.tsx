import React from "react";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../../DFlow.edges.hook";
import "./DFlowFunctionGroupCard.style.scss";
import Card from "../../../card/Card";

export interface DFlowFunctionGroupCardProps extends NodeProps<Node> {}

export const DFlowFunctionGroupCard: React.FC<DFlowFunctionGroupCardProps> = (
    {data, className, style, children, ...rest}
) => {
    const depth = (data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];
    return (
        <Card
            {...rest}
            variant={"outlined"}
            className={`function-group ${className ?? ""}`}
            style={{...(style || {}), border: `2px solid ${color}`, background: "transparent"}}
        >
            <Handle
                type="source"
                position={Position.Top}
                className="function-group__handle"
                isConnectable={false}
            />
            {children}
        </Card>
    );
};