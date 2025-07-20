import {Code0Component} from "../../utils/types";
import {BaseEdge, Edge, EdgeProps, getSmoothStepPath, Position} from "@xyflow/react";
import React from "react";

export interface DFlowEdgeDataProps extends Code0Component<HTMLDivElement> {
    //some data we will use
}

// @ts-ignore
export type DFlowEdgeProps = EdgeProps<Edge<DFlowEdgeDataProps>>

const calcEdgePositions = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number
): { sourcePosition: Position; targetPosition: Position } => {
    const dx = Math.abs(targetX - sourceX)
    const dy = Math.abs(targetY - sourceY)

    // Horizontaler Abstand dominiert: Edge geht von Left nach Right
    if (dx > dy) {
        return {
            sourcePosition: sourceX < targetX ? Position.Right : Position.Left,
            targetPosition: sourceX < targetX ? Position.Left : Position.Right,
        }
    }
    // Vertikaler Abstand dominiert: Edge geht von Bottom nach Top (bzw. oben/unten)
    return {
        sourcePosition: sourceY < targetY ? Position.Bottom : Position.Top,
        targetPosition: sourceY < targetY ? Position.Top : Position.Bottom,
    }
}

export const DFlowEdge: React.FC<DFlowEdgeProps> = (props) => {

    const {sourceX, sourceY, targetX, targetY, id, ...rest} = props

    const {sourcePosition, targetPosition} = calcEdgePositions(
        sourceX, sourceY, targetX, targetY
    )

    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return <BaseEdge id={id} path={edgePath} {...rest}/>

}