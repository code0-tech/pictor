import {Code0Component} from "../../utils/types";
import {BaseEdge, Edge, EdgeProps, getSmoothStepPath, Position} from "@xyflow/react";
import React from "react";

export interface DFlowEdgeDataProps extends Code0Component<HTMLDivElement> {
    //some data we will use
    color?: string
    isParameter?: boolean
}

// @ts-ignore
export type DFlowEdgeProps = EdgeProps<Edge<DFlowEdgeDataProps>>

export const DFlowEdge: React.FC<DFlowEdgeProps> = (props) => {

    const {sourceX, sourceY, targetX, targetY, id, data, ...rest} = props

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition: data?.isParameter ? Position.Left : Position.Top,
        targetX,
        targetY,
        targetPosition: data?.isParameter ? Position.Right : Position.Bottom,
    })

    return <BaseEdge id={id} path={edgePath} style={{ stroke: data?.color}}/>

}