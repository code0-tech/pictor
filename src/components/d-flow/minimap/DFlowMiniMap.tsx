import React from "react";
import {MiniMap, Panel, useNodes} from "@xyflow/react";
import {FLOW_EDGE_RAINBOW} from "../DFlow.edges.hook";
import "./DFlowMiniMap.style.scss"

export const DFlowMiniMap: React.FC = (props) => {

    const nodes = useNodes();

    return <Panel position={"bottom-right"}>
        <MiniMap offsetScale={0} pannable zoomable className={"d-flow-viewport-mini-map"} nodeComponent={props1 => {

            const node = nodes.find(node => node.id === props1.id)
            if (!node) return null

            if (node.type == "suggestion") return null

            if (node.type == "group") {

                const depth = (node.data as any)?.depth ?? 0;
                const color = FLOW_EDGE_RAINBOW[depth % FLOW_EDGE_RAINBOW.length];

                return <rect width={props1.width}
                             height={props1.height}
                             rx={50}
                             ry={50}
                             fill={color}
                             fillOpacity={0.05}
                             stroke={color}
                             strokeWidth={2}
                             stroke-dasharray="20"
                             className={"d-flow-viewport-mini-map__group"}
                             x={props1.x}
                             y={props1.y}/>
            }

            return <rect width={props1.width}
                         height={props1.height}
                         x={props1.x}
                         rx={25}
                         ry={25}
                         fill={"rgb(28.2, 25.5, 43.5)"}
                         y={props1.y}/>

        }}/>
    </Panel>

}