import {Code0ComponentProps} from "../../utils/types";
import {ConnectionLineType, Node, ReactFlow, ReactFlowProps, useEdgesState, useNodesState} from "@xyflow/react";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import '@xyflow/react/dist/style.css';
import "./DFlow.style.scss"

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

    // 2. Identify root/main nodes (nodes that are not parameters or have no parent and are not inside a group).
    const roots = nodes.filter(
        n => (!n.data?.isParameter || !n.data?.parentId) && !n.parentNode
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

        // Find direct children for this node.
        if (node.type === 'group') {
            const groupRoots = nodes.filter(
                n => n.parentNode === node.id && !n.data?.parentId
            );
            let innerY = cy - h / 2;
            groupRoots.forEach(root => {
                const rh = root.measured?.height ?? 80;
                const rcy = innerY + rh / 2;
                layout(root, cx, rcy);
                innerY = rcy + rh / 2 + V_SPACING;
            });
            return cy + h / 2;
        }

        const allChildren = (children.get(node.id) ?? []).sort(
            (a, b) => (a.data?.paramIndex ?? 0) - (b.data?.paramIndex ?? 0)
        );
        const sideParams = allChildren.filter((c: any) => c.type !== 'group');
        const downGroups = allChildren.filter((c: any) => c.type === 'group');

        // Compute the total vertical height of parameter nodes on the side including spacing.
        const paramHeights = sideParams.map(p => p.measured?.height ?? 80);
        const paramBlockHeight = paramHeights.length
            ? paramHeights.reduce((sum, h, i) => sum + h + (i ? V_SPACING : 0), 0)
            : 0;

        // Center side parameters vertically relative to parent node.
        let paramY = cy - paramBlockHeight / 2;
        sideParams.forEach((param: any, i: number) => {
            const pw = param.measured?.width ?? 200;
            const ph = paramHeights[i];
            const px = cx + w / 2 + H_SPACING + pw / 2;
            const py = paramY + ph / 2;

            pos.set(param.id, {x: px, y: py});

            layout(param, px, py);

            paramY += ph + V_SPACING;
        });

        // Place group parameters below the node.
        let blockBottom = cy + h / 2;
        downGroups.forEach((group: any) => {
            const gh = group.measured?.height ?? 80;
            const gx = cx;
            const gy = blockBottom + V_SPACING + gh / 2;
            pos.set(group.id, {x: gx, y: gy});
            layout(group, gx, gy);
            blockBottom = gy + gh / 2;
        });

        // The block height is the max of node height, side params and groups below.
        const maxBottom = Math.max(blockBottom, cy + Math.max(h, paramBlockHeight) / 2);
        return maxBottom;
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
        const {x, y} = pos.get(node.id) ?? {x: 0, y: 0};
        const w = node.measured?.width ?? 200;
        const h = node.measured?.height ?? 80;
        let px = x - w / 2;
        let py = y - h / 2;

        if (node.parentNode) {
            const parent = nodes.find(n => n.id === node.parentNode);
            if (parent) {
                const {x: pxp, y: pyp} = pos.get(parent.id) ?? {x: 0, y: 0};
                const pw = parent.measured?.width ?? 200;
                const ph = parent.measured?.height ?? 80;
                px -= pxp - pw / 2;
                py -= pyp - ph / 2;
            }
        }

        return {
            ...node,
            position: {x: px, y: py},
        };
    });

    return {nodes: positionedNodes, edges};
}

export type DFlowProps = Code0ComponentProps & ReactFlowProps

export const DFlow: React.FC<DFlowProps> = (props) => {

    const calculated = React.useRef<boolean>(false)
    const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes!!)
    const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges!!)

    const nodeChangeEvent = React.useCallback((changes: any) => {
        const localNodes = nodes.map(value => {
            return {
                ...value,
                measured: {
                    width: changes.find((change: any) => change.id === value.id)?.dimensions?.width ?? 0,
                    height: changes.find((change: any) => change.id === value.id)?.dimensions?.height ?? 0,
                }
            } as Node
        })

        if (!calculated.current) {
            const layouted = getLayoutedElements(localNodes, props.edges!!)
            setNodes([...layouted.nodes])
            calculated.current = true
        }
    }, [calculated, nodes, edges])

    React.useEffect(() => {
        calculated.current = false
        setNodes([...props.nodes!!])
        setEdges([...props.edges!!])
    }, [props.nodes, props.edges])

    return <ReactFlow panOnDrag={true}
                      onInit={(reactFlowInstance) =>  reactFlowInstance.fitView()}
                      zoomOnScroll
                      onNodesChange={nodeChangeEvent}
                      onEdgesChange={onEdgesChange} {...mergeCode0Props("flow", props)}
                      nodes={nodes}
                      edges={edges}/>

}