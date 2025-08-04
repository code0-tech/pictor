import React from "react";
import {NodeProps, Node} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../../DFlow.edges.hook";
import "./DFlowFunctionGroupCard.style.scss";
import Card from "../../../card/Card";
import {Code0Component} from "../../../../utils/types";
import {NodeFunctionObject} from "../../DFlow.view";

type CodeZeroComponentProps = Code0Component<HTMLDivElement>;

// @ts-ignore
export interface DFlowFunctionGroupCardProps extends NodeProps<Node<CodeZeroComponentProps & NodeFunctionObject>> {
}

export const DFlowFunctionGroupCard: React.FC<DFlowFunctionGroupCardProps> = (props) => {
    const depth = (props.data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];
    return <Card {...props} className="function-group" style={{border: `2px solid ${color}`, background: "transparent"}} />;
};
