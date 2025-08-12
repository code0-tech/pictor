import {Code0ComponentProps} from "../../utils/types";
import {Edge, Node, ReactFlow, ReactFlowProps, useEdgesState, useNodesState} from "@xyflow/react";
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
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    /* Konstanten */
    const V = 100;          // vertical gap Node ↕ Node
    const H = 100;          // horizontal gap Parent → Param
    const PAD = 12;         // inner padding einer Group (links+rechts / oben+unten)
    const EPS = 0.25;       // Toleranz gegen Rundungsdrift

    // Wir iterieren, bis Group-Maße stabil sind
    let pass = 0;
    let changed = false;

    // Aktueller Arbeitsstand der Nodes (Styles werden in den Pässen fortgeschrieben)
    let work = nodes.map(n => ({...n}));

    do {
        changed = false;
        pass++;

        /* Helper-Maps ---------------------------------------------------------- */
        const byId = new Map(work.map(n => [n.id, n]));
        const rfKids = new Map<string, Node[]>();   // echte RF-Kinder (parentId gesetzt, aber kein linkingId)
        const params = new Map<string, Node[]>();   // Parameter je Parent (linkingId === parent.id)

        work.forEach(n => {
            const link = (n.data as any)?.linkingId;
            if (link) {
                (params.get(link) ?? (params.set(link, []), params.get(link)!)).push(n);
            }
            if (n.parentId && !link) {
                (rfKids.get(n.parentId) ?? (rfKids.set(n.parentId, []), rfKids.get(n.parentId)!)).push(n);
            }
        });

        /* ---------- Größen ---------------------------------------------------- */
        type Size = { w: number; h: number };
        const cache = new Map<string, Size>();

        const measured = (n: Node): Size => {
            const styleW = typeof n.style?.width === 'number' ? n.style.width : undefined;
            const styleH = typeof n.style?.height === 'number' ? n.style.height : undefined;
            const mw = n.measured?.width && n.measured.width > 0 ? n.measured.width : undefined;
            const mh = n.measured?.height && n.measured.height > 0 ? n.measured.height : undefined;
            return {
                w: styleW ?? mw ?? 200,
                h: styleH ?? mh ?? 80,
            };
        };

        const size = (n: Node): Size => {
            if (cache.has(n.id)) return cache.get(n.id)!;

            if (n.type !== 'group') {
                const s = measured(n);
                cache.set(n.id, s);
                return s;
            }

            // Für Groups: wenn Style-Maße (aus vorherigem Pass) existieren, zuerst diese verwenden.
            const styleW = typeof n.style?.width === 'number' ? n.style.width : undefined;
            const styleH = typeof n.style?.height === 'number' ? n.style.height : undefined;
            if (styleW !== undefined && styleH !== undefined) {
                const s = {w: styleW, h: styleH};
                cache.set(n.id, s);
                return s;
            }

            // ansonsten aus RF-Kindern abschätzen (inkl. V-Stack + Innen-Padding)
            const kids = rfKids.get(n.id) ?? [];
            const kSizes = kids.map(size);

            const stackH = kSizes.reduce((s, k) => s + k.h, 0) + V * Math.max(0, kSizes.length - 1);
            const wMax = Math.max(0, ...kSizes.map(k => k.w));

            const g = {
                w: wMax + 2 * PAD,
                h: (kids.length ? stackH : 0) + 2 * PAD,
            };
            cache.set(n.id, g);
            return g;
        };

        // Pre-Warm Größen
        work.forEach(size);

        /* ---------- relatives Layout (Zentren in globalen Koordinaten) -------- */
        type Pos = { x: number; y: number };
        const rel = new Map<string, Pos>();

        const layout = (n: Node, cx: number, cy: number): number => {
            rel.set(n.id, {x: cx, y: cy});
            const {w, h} = size(n);

            /* 1) einfache Parameter rechts (keine Groups) */
            const right = (params.get(n.id) ?? [])
                .filter(p => p.type !== 'group')
                .sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex));

            const rightH = right.reduce((s, p) => s + size(p).h, 0) + V * Math.max(0, right.length - 1);
            let py = cy - rightH / 2;
            right.forEach(p => {
                const ps = size(p);
                const px = cx + w / 2 + H + ps.w / 2;
                layout(p, px, py + ps.h / 2);
                py += ps.h + V;
            });

            let bottom = Math.max(
                cy + h / 2,          // Unterkante des Nodes selbst
                cy + rightH / 2      // Unterkante des rechten Param-Stacks
            );

            /* 2) Gruppen-Parameter (in einer Zeile unter dem Node) */
            const gParams = (params.get(n.id) ?? [])
                .filter(p => p.type === 'group')
                .sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex));

            if (gParams.length) {
                const gSizes = gParams.map(size);
                const rowW = gSizes.reduce((s, g) => s + g.w, 0) + H * (gParams.length - 1);

                let gx = cx - rowW / 2;
                const gy = bottom + V;  // Start der Param-Group-Row

                let rowBottom = bottom;
                gParams.forEach((g, i) => {
                    const gs = gSizes[i];
                    const subBottom = layout(g, gx + gs.w / 2, gy + gs.h / 2);
                    rowBottom = Math.max(rowBottom, subBottom);
                    gx += gs.w + H;
                });

                bottom = rowBottom;
            }

            /* 3) RF-Kinder in Group-Box (vertikal) */
            if (n.type === 'group') {
                const kids = (rfKids.get(n.id) ?? []).filter(k => !(k.data as any)?.linkingId);
                let curY = cy - h / 2 + PAD;

                kids.forEach(k => {
                    const ks = size(k);
                    const subBottom = layout(k, cx, curY + ks.h / 2);
                    curY = subBottom + V; // nutze tatsächliche Unterkante (verschachtelte Höhe!)
                });

                const contentBottom = curY - V; // Unterkante des letzten Kindes
                bottom = Math.max(bottom, contentBottom + PAD);
            }

            return bottom;
        };

        /* Root-Nodes untereinander stapeln (nur echte Roots, keine Param-Nodes) */
        let yCursor = 0;
        work
            .filter(n => !(n.data as any)?.linkingId && !n.parentId)
            .forEach(r => {
                const b = layout(r, 0, yCursor + size(r).h / 2);
                yCursor = b + V;
            });

        /* ---------- rel (Center) → abs (Top-Left) ----------------------------- */
        const absCenter = new Map<string, Pos>();
        work.forEach(n => absCenter.set(n.id, rel.get(n.id)!));

        const absTL_initial = new Map<string, Pos>();
        work.forEach(n => {
            const {w, h} = size(n);
            const {x, y} = absCenter.get(n.id)!;
            absTL_initial.set(n.id, {x: x - w / 2, y: y - h / 2});
        });

        /* ---------- positions in RF-Koordinaten (Top-Left), ggf. relativ zu Parent */
        let positioned = work.map(n => {
            const tl = absTL_initial.get(n.id)!;

            let px = tl.x;
            let py = tl.y;

            if (n.parentId) {
                const pTL = absTL_initial.get(n.parentId)!;
                px -= pTL.x;
                py -= pTL.y;
            }

            return {...n, position: {x: px, y: py}} as Node;
        });

        const posById = new Map(positioned.map(n => [n.id, n]));

        /* ---------- Bounding-Korrektur jeder Group ----------------------------- */
        const depth = (g: Node) => {
            let d = 0, p: Node | undefined = g;
            while (p?.parentId) {
                d++;
                p = posById.get(p.parentId);
            }
            return d;
        };

        // innerste zuerst
        const groups = positioned.filter(n => n.type === 'group').sort((a, b) => depth(b) - depth(a));

        groups.forEach(g => {
            // *** Nur direkte Kinder dieser Group berücksichtigen ***
            const direct = positioned.filter(k => k.parentId === g.id);

            if (!direct.length) {
                // leere Group: min. 2*PAD
                const gw = typeof g.style?.width === 'number' ? g.style.width : 2 * PAD;
                const gh = typeof g.style?.height === 'number' ? g.style.height : 2 * PAD;
                g.style = {...(g.style as React.CSSProperties), width: gw, height: gh};
                return;
            }

            // Hilfsfunktion: aktuelle Größe eines Childs (Style bevorzugt)
            const childSize = (n: Node): Size => {
                const sw = typeof n.style?.width === 'number' ? n.style.width : undefined;
                const sh = typeof n.style?.height === 'number' ? n.style.height : undefined;
                // ACHTUNG: size() kann gecached sein – Style bevorzugen
                const s = measured(n);
                return {w: sw ?? s.w, h: sh ?? s.h};
            };

            // Bounds relativ zur Group-Top-Left (direkte Kinder!)
            let minX = Number.POSITIVE_INFINITY,
                minY = Number.POSITIVE_INFINITY,
                maxX = Number.NEGATIVE_INFINITY,
                maxY = Number.NEGATIVE_INFINITY;

            direct.forEach(k => {
                const ks = childSize(k);
                minX = Math.min(minX, k.position.x);
                minY = Math.min(minY, k.position.y);
                maxX = Math.max(maxX, k.position.x + ks.w);
                maxY = Math.max(maxY, k.position.y + ks.h);
            });

            // Innen-Offset, so dass Inhalt bei PAD beginnt
            const dx = minX - PAD;
            const dy = minY - PAD;

            if (Math.abs(dx) > EPS || Math.abs(dy) > EPS) {
                // *** nur direkte Kinder verschieben ***
                direct.forEach(k => {
                    k.position.x -= dx;
                    k.position.y -= dy;
                });
                changed = true;

                minX -= dx;
                minY -= dy;
                maxX -= dx;
                maxY -= dy;
            }

            const newW = (maxX - minX) + 2 * PAD;
            const newH = (maxY - minY) + 2 * PAD;

            const oldW = typeof g.style?.width === 'number' ? g.style.width : measured(g).w;
            const oldH = typeof g.style?.height === 'number' ? g.style.height : measured(g).h;

            if (Math.abs(newW - oldW) > EPS || Math.abs(newH - oldH) > EPS) {
                changed = true;
            }

            g.measured = {
                width: newW,
                height: newH,
            }
            g.style = {
                ...(g.style as React.CSSProperties),
                width: newW,
                height: newH,
            };
        });

        /* ---------- Param-Group-Row nach Bounding sauber zentrieren ----------- */
        // WICHTIG: Größen-Cache invalidieren, da Group-Styles sich geändert haben
        cache.clear();
        positioned.forEach(size);

        // Globale Center bleiben in rel; aber Top-Left muss mit NEUEN Größen berechnet werden
        const absTL = new Map<string, Pos>();
        const absCenterAfter = new Map<string, Pos>();
        positioned.forEach(n => {
            const s = size(n);
            const c = rel.get(n.id)!; // globales Center aus dem Layout-Durchlauf
            absCenterAfter.set(n.id, c);
            absTL.set(n.id, {x: c.x - s.w / 2, y: c.y - s.h / 2});
        });

        positioned.forEach(parent => {
            const pGroups = (params.get(parent.id) ?? []).filter(p => p.type === 'group');
            if (!pGroups.length) return;

            const ordered = pGroups.slice().sort((a, b) =>
                (+((a.data as any)?.paramIndex) || 0) -
                (+((b.data as any)?.paramIndex) || 0)
            );

            const widths = ordered.map(g => {
                const gn = posById.get(g.id)!;
                const sw = typeof gn.style?.width === 'number' ? gn.style.width : undefined;
                return sw ?? size(gn).w;
            });
            const rowW = widths.reduce((s, w) => s + w, 0) + H * (ordered.length - 1);

            // Parent-Center (global, nach Bounding-Größen)
            const pCenterX = absCenterAfter.get(parent.id)!.x;

            // Start-X in globalen Koordinaten
            let gx = pCenterX - rowW / 2;

            ordered.forEach((g, i) => {
                const gn = posById.get(g.id)!;

                // *** NEU: in Parent-Row gegen das tatsächliche Container-TL (gn.parentId) umrechnen ***
                const containerTL = gn.parentId ? absTL.get(gn.parentId)! : {x: 0, y: 0};

                // setze linke Kante relativ zum Container
                gn.position.x = gx - containerTL.x;

                // nächstes Element mit konstantem H
                gx += widths[i] + H;
            });
        });

        // Arbeitsstand für evtl. nächste Runde übernehmen
        work = positioned.map(n => ({...n}));

    } while (changed && pass < 5);

    return {nodes: work, edges};
};

export type DFlowProps = Code0ComponentProps & ReactFlowProps

export const DFlow: React.FC<DFlowProps> = (props) => {

    const calculated = React.useRef<boolean>(false)
    const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes!!)
    const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges!!)

    const nodeChangeEvent = React.useCallback((changes: any) => {
        if (calculated.current) return
        calculated.current = true

        const localNodes = nodes.map(value => {
            const node = document.querySelectorAll("[data-id='" + value.id + "']")
            return {
                ...value,
                measured: {
                    width: changes.find((change: any) => change.id === value.id)?.dimensions?.width ?? value.measured?.width ?? node[0].getBoundingClientRect().width ?? 0,
                    height: changes.find((change: any) => change.id === value.id)?.dimensions?.height ?? value.measured?.height ?? node[0].getBoundingClientRect().height ?? 0,
                }
            } as Node
        })

        const layouted = getLayoutedElements(localNodes, edges)
        setNodes(layouted.nodes as Node[])
        setEdges(layouted.edges as Edge[])
    }, [calculated, nodes, edges, props.nodes, props.edges])

    React.useEffect(() => {
        calculated.current = false
        setNodes(props.nodes as Node[])
        setEdges(props.edges as Edge[])
    }, [props.nodes, props.edges])

    return <ReactFlow panOnDrag={true}
                      onInit={(reactFlowInstance) => reactFlowInstance.fitView()}
                      zoomOnScroll
                      onNodesChange={nodeChangeEvent}
                      {...mergeCode0Props("flow", props)}
                      nodes={nodes}
                      edges={edges}/>

}