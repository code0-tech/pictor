import {Code0Component} from "../../utils";
import {BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, Position} from "@xyflow/react";
import React, {memo} from "react";
import {Badge} from "../badge/Badge";
import {Flow, NodeFunction} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowEdgeDataProps extends Code0Component<HTMLDivElement> {
    //some data we will use
    color?: string
    type: 'parameter' | 'suggestion' | 'group' | 'default'
    parentNodeId?: NodeFunction['id'] | null
    flowId: Flow['id']
}

// @ts-ignore
export type DFlowEdgeProps = EdgeProps<Edge<DFlowEdgeDataProps>>

export const DFlowEdge: React.FC<DFlowEdgeProps> = memo((props) => {
    const {
        sourceX,
        sourceY,
        targetX,
        targetY,
        id,
        data,
        label,
        style,
        ...rest
    } = props

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition: data?.type === "parameter" ? Position.Left : Position.Bottom,
        targetX,
        targetY,
        targetPosition: data?.type === "parameter" ? Position.Right : Position.Top,
        borderRadius: 16,
        stepPosition: 0.5,
    })
    const color = data?.color ?? "#ffffff"
    const gradientId = `dflow-edge-gradient-${id}`

    return (
        <>
            {/* Gradient-Definition für genau diese Edge */}
            <defs>
                <linearGradient
                    id={gradientId}
                    x1={sourceX}
                    y1={sourceY}
                    x2={targetX}
                    y2={targetY}
                    gradientUnits="userSpaceOnUse"
                >
                    {/* Start: volle Farbe */}
                    <stop offset="0" stopColor={color} stopOpacity={0.25}/>
                    {/* Ende: gleiche Farbe, aber transparent */}
                    <stop offset="1" stopColor={color} stopOpacity={0.75}/>
                </linearGradient>
            </defs>

            <BaseEdge
                id={id}
                path={edgePath}
                {...rest}
                style={{
                    stroke: `url(#${gradientId})`,
                    strokeWidth: data?.type === "default" ? "3px" : "2px",
                    strokeLinecap: "round"
                }}
            />

            {label ? (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                            pointerEvents: "all",
                            zIndex: 100,
                        }}
                    >
                        <Badge color={"primary"} border>
                            {label}
                        </Badge>
                    </div>
                </EdgeLabelRenderer>
            ) : null}
        </>
    )
})