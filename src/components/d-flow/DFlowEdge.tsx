import {Code0Component} from "../../utils/types";
import {BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, Position} from "@xyflow/react";
import React from "react";
import Badge from "../badge/Badge";

export interface DFlowEdgeDataProps extends Code0Component<HTMLDivElement> {
    //some data we will use
    color?: string
    isParameter?: boolean
}

// @ts-ignore
export type DFlowEdgeProps = EdgeProps<Edge<DFlowEdgeDataProps>>

export const DFlowEdge: React.FC<DFlowEdgeProps> = (props) => {

    const {sourceX, sourceY, targetX, targetY, id, data, ...rest} = props

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition: data?.isParameter ? Position.Left : Position.Bottom,
        targetX,
        targetY,
        targetPosition: data?.isParameter ? Position.Right : Position.Top,
        borderRadius: 32,
        centerY: targetY - 50
    })

    return <>
        <BaseEdge id={id} path={edgePath} style={{ stroke: data?.color}}/>
        {props.label ? (
            <EdgeLabelRenderer>
                <div style={{
                    position: 'absolute',
                    transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    pointerEvents: 'all',
                }}>
                    <Badge>
                        {props.label}
                    </Badge>
                </div>
            </EdgeLabelRenderer>
        ) : null}

    </>

}