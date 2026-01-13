import React, {memo} from "react";
import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {Card} from "../card/Card";
import {DFlowNodeProps} from "./DFlowNode";

export type DFlowNodeGroupCardProps = NodeProps<Node<DFlowNodeProps>>

export const DFlowNodeGroupCard: React.FC<DFlowNodeGroupCardProps> = memo((props) => {
    const {data, id} = props

    return (
        <Card w={"100%"} h={"100%"}
              style={{background: mixColorRgb(data.color!!, 9), border: `2px dashed ${withAlpha(data.color!!, 0.1)}`}}>
            <Handle
                type="target"
                position={Position.Top}
                className={"d-flow-node__handle d-flow-node__handle--target"}
                isConnectable={false}
                draggable={false}
                style={{top: "0px", left: "50%", transform: "translateX(-50%)"}}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className={"d-flow-node__handle d-flow-node__handle--source"}
                isConnectable={false}
                draggable={false}
                style={{bottom: "0px", left: "50%", transform: "translateX(-50%)"}}
            />
        </Card>
    );
});

/* ===========================
   Color utilities
   =========================== */

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

const parseCssColorToRgba = (color: string): any => {
    if (typeof document === "undefined") {
        return {r: 0, g: 0, b: 0, a: 1}
    }

    const el = document.createElement("span")
    el.style.color = color
    document.body.appendChild(el)

    const computed = getComputedStyle(el).color
    document.body.removeChild(el)

    const match = computed.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/
    )

    if (!match) {
        return {r: 0, g: 0, b: 0, a: 1}
    }

    return {
        r: Math.round(Number(match[1])),
        g: Math.round(Number(match[2])),
        b: Math.round(Number(match[3])),
        a: match[4] !== undefined ? Number(match[4]) : 1,
    }
}

const mixColorRgb = (color: string, level: number) => {
    const w = clamp01(level * 0.1)

    const c1 = parseCssColorToRgba(color)
    const c2 = parseCssColorToRgba("#030014")

    const mix = (a: number, b: number) =>
        Math.round(a * (1 - w) + b * w)

    return `rgb(${mix(c1.r, c2.r)}, ${mix(c1.g, c2.g)}, ${mix(c1.b, c2.b)})`
}

const withAlpha = (color: string, alpha: number) => {
    const c = parseCssColorToRgba(color)
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${clamp01(alpha)})`
}
