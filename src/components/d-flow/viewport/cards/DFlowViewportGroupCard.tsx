import React, {memo} from "react";
import {Handle, NodeProps, Position} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../DFlowViewport.edges.hook";
import Card from "../../../card/Card";

export interface DFlowViewportGroupCardProps extends NodeProps {
}

export const DFlowViewportGroupCard: React.FC<DFlowViewportGroupCardProps> = memo((
    {data, ...rest}
) => {
    const depth = (data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];
    return (
        <Card w={"100%"} h={"100%"}
              style={{background: withAlpha(color, 0.05), boxShadow: "none", border: "2px dashed " + withAlpha(color, 0.25)}}>
            <Handle
                type="target"
                position={Position.Top}
                className={"function-card__handle function-card__handle--target"}
                isConnectable={false}
                draggable={false}
                style={{top: "2px"}}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className={"function-card__handle function-card__handle--source"}
                isConnectable={false}
                draggable={false}
                style={{bottom: "2px"}}
            />
        </Card>
    );
});

const withAlpha = (hex: string, alpha: number) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16);
    const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16);
    const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};