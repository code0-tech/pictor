import React from "react";
import {GroupNode, NodeProps, Node} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../../DFlow.edges.hook";
import "./DFlowFunctionGroupCard.style.scss";

export interface DFlowFunctionGroupCardProps extends NodeProps<Node> {}

export const DFlowFunctionGroupCard: React.FC<DFlowFunctionGroupCardProps> = (props) => {
    const depth = (props.data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];
    return <GroupNode {...props} className="function-group" style={{border: `2px solid ${color}`, background: "transparent"}} />;
};
