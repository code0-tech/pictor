import {Code0ComponentProps} from "../../utils/types";
import {ConnectionLineType, ReactFlow, ReactFlowProps, useEdgesState, useNodesState} from "@xyflow/react";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import '@xyflow/react/dist/style.css';
import "./DFlow.style.scss"
import type {ReactFlowInstance} from "@xyflow/react/dist/esm/types";

/**
 * Dynamically layouts a tree of nodes and their parameter nodes for a flow-based editor.
 * - Main nodes are stacked vertically with fixed vertical spacing.
 * - Parameter nodes are centered vertically alongside their parent node and recursively laid out horizontally.
 * - Sub-parameter nodes do NOT influence the vertical stacking of main nodes; only direct parameters are considered.
 *
 * @param nodes Array of all nodes to be positioned. Each node should have at least: id, measured?.width, measured?.height, data?.isParameter, data?.parentId, and optionally data?.paramIndex.
 * @param edges Array of edge objects, unchanged by this function (used only for return type symmetry).
 * @returns An object containing the new positioned nodes and the unchanged edges.
 */
const getLayoutedElements = (nodes: any[], edges: any[]) => {
    const V_SPACING = 100;   // Vertical space between main nodes.
    const H_SPACING = 100;   // Horizontal space between a parent node and its parameter nodes.

    // 1. Build a map from parent node id to its direct parameter nodes.
    const children = new Map<string, any[]>();
    for (const node of nodes) {
        const parentId = node.data?.parentId;
        if (parentId) {
            if (!children.has(parentId)) children.set(parentId, []);
            children.get(parentId)!.push(node);
        }
    }

    // 2. Identify root/main nodes (nodes that are not parameters or have no parent).
    const roots = nodes.filter(
        n => !n.data?.isParameter || !n.data?.parentId
    );

    // 3. Store calculated center positions for each node by id.
    const pos = new Map<string, { x: number; y: number }>();

    /**
     * Recursively position a node and all its parameter children.
     * @param node   The current node (main or parameter).
     * @param cx     The center x position for this node.
     * @param cy     The center y position for this node.
     * @returns      The y coordinate of the bottom edge of the "block" for this main node (including its direct parameters).
     */
    function layout(node: any, cx: number, cy: number): number {
        const w = node.measured?.width ?? 200;
        const h = node.measured?.height ?? 80;

        // Store center position for this node.
        pos.set(node.id, {x: cx, y: cy});

        // Find and sort direct parameter nodes for this node.
        const params = (children.get(node.id) ?? [])
            .sort((a, b) => (a.data?.paramIndex ?? 0) - (b.data?.paramIndex ?? 0));

        // Compute the total vertical height of all parameter nodes including spacing.
        const paramHeights = params.map(p => p.measured?.height ?? 80);
        const paramBlockHeight = paramHeights.length
            ? paramHeights.reduce((sum, h, i) => sum + h + (i ? V_SPACING : 0), 0)
            : 0;

        // The "block" height for the main node is the max of its own height or its parameter block.
        const blockHeight = Math.max(h, paramBlockHeight);

        // Center parameters vertically relative to parent node.
        let paramY = cy - paramBlockHeight / 2;
        params.forEach((param, i) => {
            const pw = param.measured?.width ?? 200;
            const ph = paramHeights[i];
            // Place parameter node to the right of the parent.
            const px = cx + w / 2 + H_SPACING + pw / 2;
            const py = paramY + ph / 2;

            pos.set(param.id, {x: px, y: py});

            // Recursively layout any sub-parameters of this parameter node.
            layout(param, px, py);

            paramY += ph + V_SPACING;
        });

        // Return the bottom y-coordinate of this main node's "block".
        return cy + blockHeight / 2;
    }

    // 4. Layout all root/main nodes vertically, keeping at least V_SPACING between each.
    let currY = 0;
    for (const root of roots) {
        const h = root.measured?.height ?? 80;
        const centerY = currY + h / 2;
        const blockBottom = layout(root, 0, centerY);
        currY = blockBottom + V_SPACING;
    }

    // 5. Generate new positioned nodes by shifting from center to top-left.
    const positionedNodes = nodes.map(node => {
        const {x, y} = pos.get(node.id)!;
        const w = node.measured?.width ?? 200;
        const h = node.measured?.height ?? 80;
        return {
            ...node,
            position: {
                x: x - w / 2,
                y: y - h / 2,
            },
        };
    });

    return {nodes: positionedNodes, edges};
}

export type DFlowProps = Code0ComponentProps & ReactFlowProps

export const DFlow: React.FC<DFlowProps> = (props) => {

    const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes!!)
    const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges!!)

    const onInit = React.useCallback((instance: ReactFlowInstance) => {
        const layouted = getLayoutedElements(instance.getNodes(), instance.getEdges())

        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
        instance.fitView()
    }, [nodes, edges])

    return <ReactFlow onInit={onInit}
                      connectionLineType={ConnectionLineType.Straight}
                      panOnDrag={true}
                      zoomOnScroll
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange} {...mergeCode0Props("flow", props)} nodes={nodes} edges={edges}/>

}