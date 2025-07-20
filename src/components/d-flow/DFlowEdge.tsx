import {Code0Component} from "../../utils/types";
import {BaseEdge, Edge, EdgeProps, getStraightPath} from "@xyflow/react";
import React from "react";

export interface DFlowEdgeDataProps extends Code0Component<HTMLDivElement> {
    //some data we will use
}

// @ts-ignore
export type DFlowEdgeProps = EdgeProps<Edge<DFlowEdgeDataProps>>

export const DFlowEdge: React.FC<DFlowEdgeProps> = (props) => {

    const {sourceX, sourceY, targetX, targetY, id} = props

    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    })

    return <BaseEdge id={id} path={edgePath} />

}