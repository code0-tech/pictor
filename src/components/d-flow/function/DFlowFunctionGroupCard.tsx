import React, {memo} from "react";
import {Handle, NodeProps, Position, useStore} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../DFlow.edges.hook";
import {Card} from "../../card/Card";

export interface DFlowFunctionGroupCardProps extends NodeProps {
}

export const DFlowFunctionGroupCard: React.FC<DFlowFunctionGroupCardProps> = memo((props) => {
    const {data, id} = props
    const depth = (data as any)?.depth ?? 0;
    const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];

    // Align handles with the first node inside this group
    const handleLeft = useStore((s) => {
        const children = s.nodes.filter((n) => n.parentId === id);
        let start: any | undefined = undefined;
        children.forEach((n) => {
            const idx = (n.data as any)?.index ?? Infinity;
            const startIdx = (start?.data as any)?.index ?? Infinity;
            if (!start || idx < startIdx) {
                start = n;
            }
        });
        if (start) {
            const width = start.measured.width ?? 0;
            return start.position.x + width / 2;
        }
        return undefined;
    })

    return (
        <Card w={"100%"} h={"100%"}
              style={{background: withAlpha(color, 0.025), boxShadow: "none", border: "2px dashed " + withAlpha(color, 0.125)}}>
            <Handle
                type="target"
                position={Position.Top}
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--target"}
                isConnectable={false}
                draggable={false}
                style={{top: "2px", left: handleLeft}}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className={"d-flow-viewport-default-card__handle d-flow-viewport-default-card__handle--source"}
                isConnectable={false}
                draggable={false}
                style={{bottom: "2px", left: handleLeft}}
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
