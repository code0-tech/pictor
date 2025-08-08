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
    /* Konstanten */
    const V = 100;          // vertical gap Node ↕ Node
    const H = 100;          // horizontal gap Parent → Param
    const PAD = 11.2;         // inner padding of a group

    /* Helper-Maps ---------------------------------------------------------- */
    const byId = new Map(nodes.map(n => [n.id, n]));
    const rfKids = new Map<string, Node[]>();
    const params = new Map<string, Node[]>();

    nodes.forEach(n => {
        const link = (n.data as any)?.linkingId;
        if (link)
            (params.get(link) ?? (params.set(link, []), params.get(link)!)).push(n);
        if (n.parentId && !link)
            (rfKids.get(n.parentId) ?? (rfKids.set(n.parentId, []), rfKids.get(n.parentId)!)).push(n);
    });

    /* ---------- Größen ---------------------------------------------------- */
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
        const kSizes = kids.map(size);
        const stackH = kSizes.reduce((s, k) => s + k.h, 0) + V * Math.max(0, kids.length - 1);

        const g = {
            w: Math.max(...kSizes.map(k => k.w), 0) + 2 * PAD,
            h: stackH + 2 * PAD
        };
        cache.set(n.id, g);
        return g;
    };
    nodes.forEach(size);

    /* ---------- relatives Layout ------------------------------------------ */
    type Pos = { x: number; y: number };
    const rel = new Map<string, Pos>();

    const layout = (n: Node, cx: number, cy: number): number => {
        rel.set(n.id, {x: cx, y: cy});
        const {w, h} = size(n);

        /* 1️⃣  »einfache« Parameter rechts */
        const right = (params.get(n.id) ?? [])
            .filter(p => p.type !== 'group')
            .sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex));

        const rightH = right.reduce((s, p) => s + size(p).h, 0) + V * Math.max(0, right.length - 1);
        let py = cy - rightH / 2;
        right.forEach(p => {
            const ps = size(p);
            layout(p, cx + w / 2 + H + ps.w / 2, py + ps.h / 2);
            py += ps.h + V;
        });

        /* 2️⃣  Gruppen-Parameter (eine Row) */
        let bottom = cy + h / 2;
        const gParams = (params.get(n.id) ?? []).filter(p => p.type === 'group');
        if (gParams.length) {
            const gSizes = gParams.map(size);
            const rowW = gSizes.reduce((s, g) => s + g.w, 0) + H * (gParams.length - 1);

            let gx = cx - rowW / 2, gy = bottom + V, maxH = 0;
            gParams.forEach((g, i) => {
                const gs = gSizes[i];
                layout(g, gx + gs.w / 2, gy + gs.h / 2);
                gx += gs.w + H;
                maxH = Math.max(maxH, gs.h);
            });
            bottom = gy + maxH + h + V;
        }

        /* 3️⃣  React-Flow-Kinder in Group-Box */
        if (n.type === 'group') {
            const kids = (rfKids.get(n.id) ?? []).filter(k => !(k.data as any)?.linkingId);
            let curY = cy - h / 2 + PAD;
            kids.forEach(k => {
                curY = layout(k, cx, curY + size(k).h / 2) + V;
            });
            bottom = Math.max(bottom, curY - V + PAD);
        } else {
            bottom = Math.max(bottom, cy + Math.max(h, rightH) / 2);
        }
        return bottom;
    };

    /* Root-Nodes untereinander stapeln */
    let yCursor = 0;
    nodes
        .filter(n => !(n.data as any)?.linkingId && !n.parentId)
        .forEach(r => yCursor = layout(r, 0, yCursor + size(r).h / 2) + V);

    /* ---------- rel → abs -------------------------------------------------- */
    const abs = new Map<string, Pos>();
    const toAbs = (n: Node): Pos => {
        if (abs.has(n.id)) return abs.get(n.id)!;
        const p = rel.get(n.id)!;
        if (!n.parentId || n.extent === 'parent') {
            abs.set(n.id, p);
            return p;
        }
        const pp = toAbs(byId.get(n.parentId)!);
        const a = {x: pp.x + p.x, y: pp.y + p.y};
        abs.set(n.id, a);
        return a;
    };
    nodes.forEach(toAbs);

    const positioned = nodes.map(n => {
        const {w, h} = size(n);
        const {x, y} = abs.get(n.id)!;

        let px = x - w / 2, py = y - h / 2;
        if (n.parentId) {
            const ps = size(byId.get(n.parentId)!);
            const pTL = {
                x: abs.get(n.parentId)!.x - ps.w / 2,
                y: abs.get(n.parentId)!.y - ps.h / 2
            };
            px -= pTL.x;
            py -= pTL.y;
        }
        return {
            ...n,
            position: {x: px, y: py}
        } as Node;
    });

    const posById = new Map(positioned.map(n => [n.id, n]));

    /* ---------- Bounding-Korrektur jeder Group ---------------------------- */
    const depth = (g: Node) => {
        let d = 0, p = g;
        while (p.parentId) {
            d++;
            p = posById.get(p.parentId)!;
        }
        return d;
    };

    positioned
        .filter(n => n.type === 'group')
        .sort((a, b) => depth(b) - depth(a))          // innerste zuerst
        .forEach(g => {
            /* alle Nachkommen dieser Group */
            const kids = positioned.filter(k => {
                for (let p = k; p.parentId;) {
                    p = posById.get(p.parentId)!;
                    if (p.id === g.id) return true;
                }
                return false;
            });
            if (!kids.length) return;

            let minX = Number.POSITIVE_INFINITY,
                minY = Number.POSITIVE_INFINITY,
                maxX = 0, maxY = 0;

            kids.forEach(k => {
                const kw = typeof k.style?.width === 'number' ? k.style.width : size(k).w;
                const kh = typeof k.style?.height === 'number' ? k.style.height : size(k).h;
                minX = Math.min(minX, k.position.x);
                minY = Math.min(minY, k.position.y);
                maxX = Math.max(maxX, k.position.x + kw);
                maxY = Math.max(maxY, k.position.y + kh);
            });

            const dx = minX - PAD;
            const dy = minY - PAD;

            if (dx || dy) {
                kids.forEach(k => {
                    k.position.x -= dx;
                    k.position.y -= dy;
                });
            }

            g.style = {
                ...(g.style as React.CSSProperties),
                width: (maxX - dx) + PAD,
                height: (maxY - dy) + PAD,
            };
        });

    /* ---------- Row-Nachkorrektur (Param-Groups) -------------------------- */
    positioned.forEach(parent => {
        const pGroups = (params.get(parent.id) ?? []).filter(p => p.type === 'group');
        if (!pGroups.length) return;

        const ordered = pGroups.slice().sort((a, b) =>
            (+((a.data as any)?.paramIndex) || 0) -
            (+((b.data as any)?.paramIndex) || 0));

        const widths = ordered.map(g => {
            const gn = posById.get(g.id)!;
            return typeof gn.style?.width === 'number' ? gn.style.width : size(gn).w;
        });
        const rowW = widths.reduce((s, w) => s + w, 0) + H * (ordered.length - 1);

        /* ------------------------------------------------------------------
           **Fix**: abs.get(parent.id) enthält bereits die X-Koordinate
           des Parent-Mittelpunkts – das zusätzliche + size(parent).w/2
           hatte die Row um eine halbe Parent-Breite verschoben.
        ------------------------------------------------------------------ */
        const parentCenter = abs.get(parent.id)!.x;   // ← Korrektur

        let gx = parentCenter - rowW / 2;
        ordered.forEach((g, i) => {
            posById.get(g.id)!.position.x = gx;
            gx += widths[i] + H;
        });
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