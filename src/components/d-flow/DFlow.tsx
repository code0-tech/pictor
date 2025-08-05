import {Code0ComponentProps} from "../../utils/types";
import {Node, ReactFlow, ReactFlowProps, useEdgesState, useNodesState} from "@xyflow/react";
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
const getLayoutedElements = (nodes: Node[], edges: any[]) => {
    /* Grund-Konstanten -------------------------------------------------- */
    const V = 100;      // vertikal Main ↕ Main
    const H = 100;      // Parent → erste Param-Spalte
    const PAD = 11.2;     // Innen-Padding Group-Box

    /* Helper-Maps ------------------------------------------------------- */
    const byId = new Map(nodes.map(n => [n.id, n]));

    // React-Flow-Kinder (auf `parentId` basierend)
    const rfKids = new Map<string, Node[]>();
    // fachliche Parameter (rechte Spalte / Gruppen-Parameter)
    const params = new Map<string, Node[]>();

    nodes.forEach(n => {
        if (n.parentId) {
            (rfKids.get(n.parentId) ??
                (rfKids.set(n.parentId, []), rfKids.get(n.parentId)!)).push(n);
        }
        const link = (n.data as any)?.linkingId;
        if (link) {
            (params.get(link) ??
                (params.set(link, []), params.get(link)!)).push(n);
        }
    });

    /* Größe jeder Node (inkl. Group-Boxes) ------------------------------ */
    type Size = { w: number; h: number };
    const cache = new Map<string, Size>();

    const measured = (n: Node): Size => ({
        w: n.measured?.width && n.measured.width > 0 ? n.measured.width : 200,
        h: n.measured?.height && n.measured.height > 0 ? n.measured.height : 80,
    });

    const size = (n: Node): Size => {
        if (cache.has(n.id)) return cache.get(n.id)!;

        if (n.type !== 'group') {
            const s = measured(n);
            cache.set(n.id, s);
            return s;
        }

        const kids = rfKids.get(n.id) ?? [];
        if (!kids.length) {
            const s = {w: 0, h: 0};
            cache.set(n.id, s);
            return s;
        }

        const kSz = kids.map(size);
        const stackedH = kSz.reduce((sum, k) => sum + k.h, 0) +
            V * (kids.length - 1);

        const s = {
            w: Math.max(...kSz.map(k => k.w)) + 2 * PAD,
            h: stackedH + 2 * PAD,
        };
        cache.set(n.id, s);
        return s;
    };
    nodes.forEach(size);

    /* Relatives Layout (Center-Koordinaten) ----------------------------- */
    type Pos = { x: number; y: number };
    const rel = new Map<string, Pos>();

    const layout = (n: Node, cx: number, cy: number): number => {
        rel.set(n.id, {x: cx, y: cy});
        const {w, h} = size(n);

        /* 1️⃣  rechte Parameter-Karten (type ≠ 'group') */
        const right = (params.get(n.id) ?? [])
            .filter(p => p.type !== 'group')
            .sort((a, b) =>
                Number((a.data as any)?.paramIndex ?? 0) -
                Number((b.data as any)?.paramIndex ?? 0)
            );

        const rightBlockH =
            right.map(size).reduce((s, z) => s + z.h, 0) +
            Math.max(0, right.length - 1) * V;

        let py = cy - rightBlockH / 2;
        right.forEach(p => {
            const ps = size(p);
            const px = cx + w / 2 + H + ps.w / 2;
            layout(p, px, py + ps.h / 2);
            py += ps.h + V;
        });

        /* 2️⃣  Gruppen-Parameter UNTERHALB des Parents – JETZT WAAGRECHT ---------------- */
        let bottom = cy + h / 2;
        const pGroups = (params.get(n.id) ?? []).filter(p => p.type === 'group');

        if (pGroups.length) {
            /* ► Größen aller Gruppen vorab bestimmen */
            const gSizes = pGroups.map(size);

            /* ► Gesamtbreite der „Row“ = Summe Breiten + H-Abstände */
            const rowW   = gSizes.reduce((s, g) => s + g.w, 0) + H * (pGroups.length - 1);

            /* ► x-Cursor linksbündig starten (zentriert unter dem Parent) */
            let gx = cx - rowW / 2;
            const gy = bottom + V;                // gemeinsame y-Koordinate aller Groups
            let maxGH = 0;                        // höchste Group – für bottom-Update

            pGroups.forEach((g, i) => {
                const gs = gSizes[i];
                /* Center-Koordinate der jeweiligen Group */
                layout(g, gx + gs.w / 2, gy + gs.h / 2);

                gx     += gs.w + H;                 // x-Cursor zum nächsten Slot
                maxGH   = Math.max(maxGH, gs.h);
            });

            /* ► Bottom so anheben, dass die gesamte Row Platz hat */
            bottom = gy + maxGH / 2;
        }

        /* 3️⃣  RF-Kinder innerhalb einer Group-Box --------------------------- */
        if (n.type === 'group') {
            const kids = (rfKids.get(n.id) ?? []).sort(
                (a, b) => nodes.indexOf(a) - nodes.indexOf(b)
            );

            // oberer Innen­rand der Box
            let innerY = cy - h / 2 + PAD;

            kids.forEach(child => {
                const cs = size(child);

                console.log(child, cs)

                // Cursor auf die Mittel­höhe des Childs schieben
                innerY += cs.h / 2;
                layout(child, cx, innerY);            // Child zentriert platzieren
                // Cursor eine Zeile tiefer (zweite Hälfte + Spacing)
                innerY += cs.h / 2 + V;
            });

            bottom = Math.max(bottom, cy + h / 2);  // Box-Rahmen als Unterkante
        } else {
            bottom = Math.max(bottom, cy + Math.max(h, rightBlockH) / 2);
        }

        return bottom;
    };

    /* Root-Nodes (ohne linkingId) vertikal stapeln ---------------------- */
    const roots = nodes.filter(n => !(n.data as any)?.linkingId && !n.parentId);
    let currY = 0;
    roots.forEach(r => {
        const bottom = layout(r, 0, currY + size(r).h / 2);
        currY = bottom + V;
    });

    /* Rel → absolute Canvas-Koordinaten -------------------------------- */
    const abs = new Map<string, Pos>();
    const toAbs = (n: Node): Pos => {
        if (abs.has(n.id)) return abs.get(n.id)!;
        const p = rel.get(n.id)!;
        if (!n.parentId) abs.set(n.id, p);
        else if (n.extent === 'parent') {
            // bereits Group-relativ – kein weiterer Shift
            abs.set(n.id, p);
        } else {
            const pp = toAbs(byId.get(n.parentId)!);
            abs.set(n.id, {x: pp.x + p.x, y: pp.y + p.y});
        }
        return abs.get(n.id)!;
    };
    nodes.forEach(toAbs);

    /* finale Nodes (Top-Left-Shift, Style) ------------------------------ */
    const positioned = nodes.map(n => {
        const {w, h} = size(n);
        const {x, y} = abs.get(n.id)!;

        let px = x - w / 2,
            py = y - h / 2;

        if (n.parentId) {                       // shift innerhalb Group
            const ps = size(byId.get(n.parentId)!);
            const pTL = {
                x: abs.get(n.parentId)!.x - ps.w / 2,
                y: abs.get(n.parentId)!.y - ps.h / 2,
            };
            px -= pTL.x;
            py -= pTL.y;
        }

        return {
            ...n,
            position: {x: px, y: py},
            style: n.type === 'group'
                ? {
                    ...(n.style ?? {}), width: w, height: h,
                    pointerEvents: 'none', zIndex: -1
                }
                : n.style,
        };
    });

    return {nodes: positioned, edges};
};

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
            setNodes(layouted.nodes as Node[])
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