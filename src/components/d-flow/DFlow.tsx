import {Code0ComponentProps} from "../../utils/types";
import {NodeTypes, ReactFlow, ReactFlowProps, useEdgesState, useNodesState} from "@xyflow/react";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import '@xyflow/react/dist/style.css';
import "./DFlow.style.scss"
import Dagre from '@dagrejs/dagre';
import type {ReactFlowInstance} from "@xyflow/react/dist/esm/types";

const getLayoutedElements = (nodes: any, edges: any) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({rankdir: "TB"});

    edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node: any) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node: any) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return {...node, position: {x, y}};
        }),
        edges,
    };
};

export type DFlowProps = Code0ComponentProps & ReactFlowProps

export const DFlow: React.FC<DFlowProps> = (props) => {

    const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes!!)
    const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges!!)

    const onInit = React.useCallback((instance: ReactFlowInstance) => {
        const layouted = getLayoutedElements(instance.getNodes(), instance.getEdges())

        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
    }, [nodes, edges])

    return <ReactFlow onInit={onInit}
                      panOnDrag={true}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange} {...mergeCode0Props("flow", props)} nodes={nodes} edges={edges}/>

}