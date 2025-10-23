import {Code0Component} from "../../../utils/types";
import {BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, Position} from "@xyflow/react";
import React, {memo} from "react";
import Badge from "../../badge/Badge";

export interface DFlowViewportEdgeDataProps extends Code0Component<HTMLDivElement> {
    //some data we will use
    color?: string
    isParameter?: boolean
    isSuggestion?: boolean
}

// @ts-ignore
export type DFlowViewportEdgeProps = EdgeProps<Edge<DFlowViewportEdgeDataProps>>

export const DFlowViewportEdge: React.FC<DFlowViewportEdgeProps> = memo((props) => {

    const {sourceX, sourceY, targetX, targetY, id, data, ...rest} = props

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition: data?.isParameter ? Position.Left : Position.Bottom,
        targetX,
        targetY,
        targetPosition: data?.isParameter ? Position.Right : Position.Top,
        borderRadius: 16,
        centerY: data?.isSuggestion ? targetY - 37.5 : targetY - 37.5
    })

    return <>
        <BaseEdge id={id} path={edgePath} style={{stroke: data?.color}}/>
        {props.label ? (
            <EdgeLabelRenderer>
                <div style={{
                    position: 'absolute',
                    transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    pointerEvents: 'all',
                    zIndex: 100,
                }}>
                    <Badge>
                        {props.label}
                    </Badge>
                </div>
            </EdgeLabelRenderer>
        ) : null}

    </>

})