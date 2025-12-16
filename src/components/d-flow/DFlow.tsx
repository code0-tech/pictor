import {Code0ComponentProps, mergeCode0Props} from "../../utils";
import {
    Background,
    BackgroundVariant,
    Edge,
    Node,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useUpdateNodeInternals
} from "@xyflow/react";
import React from "react";
import '@xyflow/react/dist/style.css';
import "./DFlow.style.scss"
import {DFlowFunctionDefaultCard} from "../d-flow-function/DFlowFunctionDefaultCard";
import {DFlowFunctionGroupCard} from "../d-flow-function/DFlowFunctionGroupCard";
import {DFlowFunctionSuggestionCard} from "../d-flow-function/DFlowFunctionSuggestionCard";
import {DFlowFunctionTriggerCard} from "../d-flow-function/DFlowFunctionTriggerCard";
import {DFlowEdge} from "./DFlowEdge";
import {DFlowPanelSize} from "../d-flow-panel";
import {DFlowValidation} from "../d-flow-validation";
import {SegmentedControl, SegmentedControlItem} from "../segmented-control/SegmentedControl";
import {
    IconCopy,
    IconLayout,
    IconLayoutDistributeHorizontal,
    IconLayoutDistributeVertical,
    IconTrash
} from "@tabler/icons-react";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Button} from "../button/Button";
import {Flow} from "@code0-tech/sagittarius-graphql-types";
import {useFlowNodes} from "./DFlow.nodes.hook";
import {useFlowEdges} from "./DFlow.edges.hook";
import {DFlowPanelControl} from "../d-flow-panel/DFlowPanelControl";
import {DFlowPanelLayout} from "../d-flow-panel/DFlowPanelLayout";

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
const getLayoutElements = (nodes: Node[], dirtyIds?: Set<string>) => {
    if (!dirtyIds || dirtyIds.size === 0) {
        return {nodes}
    }
    /* Konstanten */
    const V = 50;          // vertical gap Node ↕ Node
    const H = 50;          // horizontal gap Parent → Param
    const PAD = 16;         // inner padding einer Group (links+rechts / oben+unten)
    const EPS = 0.25;       // Toleranz gegen Rundungsdrift

    // Wir iterieren, bis Group-Maße stabil sind
    let pass = 0;
    let changed = false;

    // Aktueller Arbeitsstand der Nodes (Styles werden in den Pässen fortgeschrieben)
    const work = nodes.map(n => ({...n}))

    // Relationen einmalig ermitteln (IDs behalten) --------------------------------
    const rfKidIds = new Map<string, string[]>()
    const paramIds = new Map<string, string[]>()
    for (const n of work) {
        const link = (n.data as any)?.linkingId;
        if (link) {
            let arr = paramIds.get(link)
            if (!arr) {
                arr = [];
                paramIds.set(link, arr)
            }
            arr.push(n.id)
        }
        if (n.parentId && !link) {
            let arr = rfKidIds.get(n.parentId)
            if (!arr) {
                arr = [];
                rfKidIds.set(n.parentId, arr)
            }
            arr.push(n.id)
        }
    }

    const rfKids = new Map<string, Node[]>()
    const params = new Map<string, Node[]>()

    const byId = new Map(work.map(n => [n.id, n]))

    for (const [k, ids] of rfKidIds) {
        const arr: Node[] = new Array(ids.length)
        for (let i = 0; i < ids.length; i++) arr[i] = byId.get(ids[i])!;
        rfKids.set(k, arr)
    }
    for (const [k, ids] of paramIds) {
        const arr: Node[] = new Array(ids.length)
        for (let i = 0; i < ids.length; i++) arr[i] = byId.get(ids[i])!;
        params.set(k, arr)
    }

    type Size = { w: number; h: number }
    const baseSizes = new Map<string, Size>()
    for (const n of work) {
        const styleW = typeof n.style?.width === 'number' ? n.style.width : undefined;
        const styleH = typeof n.style?.height === 'number' ? n.style.height : undefined;
        const mw = n.measured?.width && n.measured.width > 0 ? n.measured.width : undefined;
        const mh = n.measured?.height && n.measured.height > 0 ? n.measured.height : undefined;
        baseSizes.set(n.id, {w: styleW ?? mw ?? 200, h: styleH ?? mh ?? 80})
    }

    const sizeCache = new Map<string, Size>()
    const size = (n: Node): Size => {
        if (sizeCache.has(n.id)) return sizeCache.get(n.id)!;

        if (n.type !== 'group') {
            const s = baseSizes.get(n.id)!;
            sizeCache.set(n.id, s)
            return s;
        }

        const styleW = typeof n.style?.width === 'number' ? n.style.width : undefined;
        const styleH = typeof n.style?.height === 'number' ? n.style.height : undefined;
        if (styleW !== undefined && styleH !== undefined) {
            const s = {w: styleW, h: styleH}
            sizeCache.set(n.id, s)
            return s;
        }

        const kids = rfKids.get(n.id) ?? [];
        let stackH = 0;
        let wMax = 0;
        let count = 0;
        for (const k of kids) {
            const ks = size(k)
            stackH += ks.h;
            if (ks.w > wMax) wMax = ks.w;
            count++;
        }
        stackH += V * Math.max(0, count - 1)

        const g = {
            w: wMax + 2 * PAD,
            h: (count ? stackH : 0) + 2 * PAD,
        }
        sizeCache.set(n.id, g)
        return g;
    }

    do {
        changed = false;
        pass++;
        sizeCache.clear()
        for (const n of work) size(n)

        /* ---------- relatives Layout (Zentren in globalen Koordinaten) -------- */

        type Pos = { x: number; y: number }
        const rel = new Map<string, Pos>()

        // Merker: Unterkante je rechter Spalten-"Band", damit Parameter unterschiedlicher Parents
        // in derselben Spalte nicht kollidieren.
        const columnBottom = new Map<number, number>()
        const colKey = (x: number) => Math.round(x / 10) // 10px-Buckets gegen Floating-Drift

        const layoutIter = (root: Node, cx: number, cy: number): number => {
            type Frame = {
                node: Node;
                cx: number;
                cy: number;
                phase: number;
                w?: number;
                h?: number;
                right?: Node[];
                rightIndex?: number;
                py?: number;
                rightBottom?: number;
                childKey?: number;
                childPs?: Size;
                lastChildBottom?: number;
                gParams?: Node[];
                gSizes?: Size[];
                gIndex?: number;
                gx?: number;
                gy?: number;
                rowBottom?: number;
                kids?: Node[];
                kidIndex?: number;
                curY?: number;
                bottom?: number;
            }
            const stack: Frame[] = [{node: root, cx, cy, phase: 0}];
            let returnBottom = 0;

            while (stack.length) {
                const f = stack[stack.length - 1];
                switch (f.phase) {
                    case 0: {
                        rel.set(f.node.id, {x: f.cx, y: f.cy})
                        const {w, h} = size(f.node)
                        f.w = w;
                        f.h = h;

                        const paramsOf = params.get(f.node.id) ?? [];
                        const right: Node[] = [];
                        const gParams: Node[] = [];
                        for (const p of paramsOf) {
                            if (p.type === 'group') gParams.push(p)
                            else right.push(p)
                        }
                        right.sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex))
                        gParams.sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex))
                        f.right = right;
                        f.gParams = gParams;

                        let total = 0;
                        for (const p of right) total += size(p).h;
                        total += V * Math.max(0, right.length - 1)
                        f.py = f.cy - total / 2;
                        f.rightBottom = f.cy + h / 2;
                        f.rightIndex = 0;
                        f.phase = 1;
                        break;
                    }
                    case 1: {
                        if (f.rightIndex! < f.right!.length) {
                            const p = f.right![f.rightIndex!];
                            const ps = size(p)
                            const px = f.cx + f.w! / 2 + H + ps.w / 2;
                            let pcy = f.py! + ps.h / 2;
                            const key = colKey(px)
                            const occ = columnBottom.get(key) ?? Number.NEGATIVE_INFINITY;
                            const minTop = occ + V;
                            const desiredTop = pcy - ps.h / 2;
                            if (desiredTop < minTop) {
                                pcy = minTop + ps.h / 2;
                                f.py = pcy - ps.h / 2;
                            }
                            f.childKey = key;
                            f.childPs = ps;
                            stack.push({node: p, cx: px, cy: pcy, phase: 0})
                            f.phase = 10;
                        } else {
                            f.bottom = Math.max(f.cy + f.h! / 2, f.rightBottom!)
                            f.phase = 2;
                        }
                        break;
                    }
                    case 10: {
                        const subBottom = f.lastChildBottom!;
                        columnBottom.set(f.childKey!, Math.max(columnBottom.get(f.childKey!) ?? Number.NEGATIVE_INFINITY, subBottom))
                        f.rightBottom = Math.max(f.rightBottom!, subBottom)
                        f.py = Math.max(f.py! + f.childPs!.h + V, subBottom + V)
                        f.rightIndex!++;
                        f.phase = 1;
                        break;
                    }
                    case 2: {
                        if (f.gParams && f.gParams.length) {
                            const gSizes: Size[] = [];
                            let rowW = 0;
                            for (const g of f.gParams) {
                                const gs = size(g)
                                gSizes.push(gs)
                                rowW += gs.w;
                            }
                            rowW += H * (f.gParams.length - 1)
                            f.gSizes = gSizes;
                            f.gx = f.cx - rowW / 2;
                            f.gy = f.bottom! + V;
                            f.rowBottom = f.bottom;
                            f.gIndex = 0;
                            f.phase = 3;
                        } else {
                            f.phase = 4;
                        }
                        break;
                    }
                    case 3: {
                        if (f.gIndex! < f.gParams!.length) {
                            const g = f.gParams![f.gIndex!];
                            const gs = f.gSizes![f.gIndex!];
                            const gcx = f.gx! + gs.w / 2;
                            const gcy = f.gy! + gs.h / 2;
                            f.gx! += gs.w + H;
                            stack.push({node: g, cx: gcx, cy: gcy, phase: 0})
                            f.childPs = gs;
                            f.phase = 30;
                        } else {
                            f.bottom = f.rowBottom;
                            f.phase = 4;
                        }
                        break;
                    }
                    case 30: {
                        const subBottom = f.lastChildBottom!;
                        f.rowBottom = Math.max(f.rowBottom!, subBottom)
                        f.gIndex!++;
                        f.phase = 3;
                        break;
                    }
                    case 4: {
                        if (f.node.type === 'group') {
                            const kidsAll = rfKids.get(f.node.id) ?? [];
                            const kids: Node[] = [];
                            for (const k of kidsAll) {
                                if (!(k.data as any)?.linkingId) kids.push(k)
                            }
                            f.kids = kids;
                            f.kidIndex = 0;
                            f.curY = f.cy - f.h! / 2 + PAD;
                            f.phase = 5;
                        } else {
                            f.phase = 6;
                        }
                        break;
                    }
                    case 5: {
                        if (f.kidIndex! < f.kids!.length) {
                            const k = f.kids![f.kidIndex!];
                            const ks = size(k)
                            const ky = f.curY! + ks.h / 2;
                            stack.push({node: k, cx: f.cx, cy: ky, phase: 0})
                            f.childPs = ks;
                            f.phase = 50;
                        } else {
                            const contentBottom = f.curY! - V;
                            f.bottom = Math.max(f.bottom!, contentBottom + PAD)
                            f.phase = 6;
                        }
                        break;
                    }
                    case 50: {
                        const subBottom = f.lastChildBottom!;
                        f.curY = subBottom + V;
                        f.kidIndex!++;
                        f.phase = 5;
                        break;
                    }
                    case 6: {
                        const finished = stack.pop()!;
                        if (stack.length) {
                            stack[stack.length - 1].lastChildBottom = finished.bottom;
                        } else {
                            returnBottom = finished.bottom!;
                        }
                        break;
                    }
                }
            }

            return returnBottom;
        }

        /* Root-Nodes untereinander stapeln (nur echte Roots, keine Param-Nodes) */
        let yCursor = 0;
        for (const r of work) {
            if (!(r.data as any)?.linkingId && !r.parentId) {
                const b = layoutIter(r, 0, yCursor + size(r).h / 2)
                yCursor = b + V;
            }
        }

        /* ---------- rel (Center) → abs (Top-Left) ----------------------------- */
        const absCenter = new Map<string, Pos>()
        for (const n of work) absCenter.set(n.id, rel.get(n.id)!)

        const absTL_initial = new Map<string, Pos>()
        for (const n of work) {
            const {w, h} = size(n)
            const {x, y} = absCenter.get(n.id)!;
            absTL_initial.set(n.id, {x: x - w / 2, y: y - h / 2})
        }

        /* ---------- positions in RF-Koordinaten (Top-Left), ggf. relativ zu Parent */
        for (const n of work) {
            const tl = absTL_initial.get(n.id)!;
            let px = tl.x;
            let py = tl.y;
            if (n.parentId) {
                const pTL = absTL_initial.get(n.parentId)!;
                px -= pTL.x;
                py -= pTL.y;
            }
            n.position = {x: px, y: py}
        }

        const posById = new Map<string, Node>()
        for (const n of work) posById.set(n.id, n)

        /* ---------- Bounding-Korrektur jeder Group ----------------------------- */
        const depth = (g: Node) => {
            let d = 0, p: Node | undefined = g;
            while (p?.parentId) {
                d++;
                p = posById.get(p.parentId)
                if (!p) break;
            }
            return d;
        }

        const groups: Node[] = [];
        for (const n of work) {
            if (n.type === 'group') groups.push(n)
        }
        groups.sort((a, b) => depth(b) - depth(a))

        for (const g of groups) {
            const direct: Node[] = [];
            for (const k of work) {
                if (k.parentId === g.id) direct.push(k)
            }

            if (!direct.length) {
                const gw = typeof g.style?.width === 'number' ? g.style.width : 2 * PAD;
                const gh = typeof g.style?.height === 'number' ? g.style.height : 2 * PAD;
                g.style = {...(g.style as React.CSSProperties), width: gw, height: gh}
                continue;
            }

            const childSize = (n: Node): Size => {
                const sw = typeof n.style?.width === 'number' ? n.style.width : undefined;
                const sh = typeof n.style?.height === 'number' ? n.style.height : undefined;
                const s = baseSizes.get(n.id)!;
                return {w: sw ?? s.w, h: sh ?? s.h}
            }

            let minX = Number.POSITIVE_INFINITY,
                minY = Number.POSITIVE_INFINITY,
                maxX = Number.NEGATIVE_INFINITY,
                maxY = Number.NEGATIVE_INFINITY;

            for (const k of direct) {
                const ks = childSize(k)
                if (k.position.x < minX) minX = k.position.x;
                if (k.position.y < minY) minY = k.position.y;
                if (k.position.x + ks.w > maxX) maxX = k.position.x + ks.w;
                if (k.position.y + ks.h > maxY) maxY = k.position.y + ks.h;
            }

            const dx = minX - PAD;
            const dy = minY - PAD;

            if (Math.abs(dx) > EPS || Math.abs(dy) > EPS) {
                for (const k of direct) {
                    k.position.x -= dx;
                    k.position.y -= dy;
                }
                changed = true;
            }

            const newW = (maxX - minX) + 2 * PAD;
            const newH = (maxY - minY) + 2 * PAD;

            const oldW = typeof g.style?.width === 'number' ? g.style.width : size(g).w;
            const oldH = typeof g.style?.height === 'number' ? g.style.height : size(g).h;

            if (Math.abs(newW - oldW) > EPS || Math.abs(newH - oldH) > EPS) {
                changed = true;
            }

            g.measured = {width: newW, height: newH}
            g.style = {...(g.style as React.CSSProperties), width: newW, height: newH}
            baseSizes.set(g.id, {w: newW, h: newH})
        }

        /* ---------- Param-Group-Row nach Bounding sauber zentrieren ----------- */
        // WICHTIG: Größen-Cache invalidieren, da Group-Styles sich geändert haben
        sizeCache.clear()
        for (const n of work) size(n)

        // Globale Center bleiben in rel; aber Top-Left muss mit NEUEN Größen berechnet werden
        const absTL = new Map<string, Pos>()
        const absCenterAfter = new Map<string, Pos>()
        for (const n of work) {
            const s = size(n)
            const c = rel.get(n.id)!; // globales Center aus dem Layout-Durchlauf
            absCenterAfter.set(n.id, c)
            absTL.set(n.id, {x: c.x - s.w / 2, y: c.y - s.h / 2})
        }

        for (const parent of work) {
            const pGroups: Node[] = [];
            const paramList = params.get(parent.id) ?? [];
            for (const p of paramList) {
                if (p.type === 'group') pGroups.push(p)
            }
            if (!pGroups.length) continue;

            const ordered = pGroups.slice().sort((a, b) =>
                (+((a.data as any)?.paramIndex) || 0) - (+((b.data as any)?.paramIndex) || 0)
            )

            const widths: number[] = [];
            for (const g of ordered) {
                const gn = posById.get(g.id)!;
                const sw = typeof gn.style?.width === 'number' ? gn.style.width : undefined;
                widths.push(sw ?? size(gn).w)
            }
            let rowW = 0;
            for (const w of widths) rowW += w;
            rowW += H * (ordered.length - 1)

            const pCenterX = absCenterAfter.get(parent.id)!.x;
            let gx = pCenterX - rowW / 2;

            for (let i = 0; i < ordered.length; i++) {
                const g = ordered[i];
                const gn = posById.get(g.id)!;
                const containerTL = gn.parentId ? absTL.get(gn.parentId)! : {x: 0, y: 0}
                gn.position.x = gx - containerTL.x;
                gx += widths[i] + H;
            }
        }

    } while (changed && pass < 5)

    return {nodes: work}
}

const getCachedLayoutElements = React.cache(getLayoutElements)

export interface DFlowProps extends Code0ComponentProps {
    flowId: Flow['id']
}

export const DFlow: React.FC<DFlowProps> = (props) => {
    return <ReactFlowProvider>
        <InternalDFlow {...props}/>
    </ReactFlowProvider>
}

const InternalDFlow: React.FC<DFlowProps> = (props) => {

    const {flowId} = props
    const nodeTypes = {
        default: DFlowFunctionDefaultCard,
        group: DFlowFunctionGroupCard,
        suggestion: DFlowFunctionSuggestionCard,
        trigger: DFlowFunctionTriggerCard,
    }

    const edgeTypes = {
        default: DFlowEdge,
    }

    const initialNodes = useFlowNodes(flowId)
    const initialEdges = useFlowEdges(flowId)
    const [nodes, setNodes] = useNodesState<Node>([])
    const [edges, setEdges, edgeChangeEvent] = useEdgesState<Edge>([])
    const updateNodeInternals = useUpdateNodeInternals()

    const revalidateHandles = React.useCallback((ids: string[]) => {
        requestAnimationFrame(() => {
            ids.forEach(id => updateNodeInternals(id))
        })
    }, [updateNodeInternals])

    const nodeChangeEvent = React.useCallback((changes: any) => {
        const changedIds: string[] = Array.from(new Set(
            changes
                .filter((c: any) => c.type === 'dimensions' || c.type === 'position')
                .map((c: any) => c.id)
        ))

        const dimensionMap = new Map<string, { width?: number; height?: number }>()
        changes
            .filter((c: any) => c.type === 'dimensions')
            .forEach((c: any) => dimensionMap.set(c.id, c.dimensions))

        setNodes(prevNodes => {
            const localNodes = prevNodes.map(node => {
                if (!dimensionMap.has(node.id)) return node;
                const dims = dimensionMap.get(node.id) || {}
                return {
                    ...node,
                    measured: {
                        width: dims.width ?? node.measured?.width ?? 0,
                        height: dims.height ?? node.measured?.height ?? 0,
                    }
                } as Node;
            })

            const layouted = getCachedLayoutElements(localNodes, new Set(changedIds))
            return layouted.nodes as Node[];
        })

        revalidateHandles(changedIds)
    }, [revalidateHandles])

    React.useEffect(() => {
        const localNodes = initialNodes.map(value => {
            const nodeEls = !value.measured ? document.querySelectorAll("[data-id='" + value.id + "']") : [];
            return {
                ...value,
                measured: {
                    width: value.measured?.width ?? (nodeEls[0] as any)?.clientWidth ?? 0,
                    height: value.measured?.height ?? (nodeEls[0] as any)?.clientHeight ?? 0,
                }
            } as unknown as Node
        })

        const layouted = getCachedLayoutElements(localNodes, new Set(localNodes.map(n => n.id)))
        setNodes(layouted.nodes as Node[])
        setEdges(initialEdges as Edge[])

        revalidateHandles((layouted.nodes as Node[]).map(n => n.id))

    }, [initialNodes, initialEdges, revalidateHandles])

    return (
        <ReactFlow
            onlyRenderVisibleElements
            panOnScroll={false}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={(rf) => rf.fitView()}
            onNodesChange={nodeChangeEvent}
            onEdgesChange={edgeChangeEvent}
            fitView
            {...mergeCode0Props("flow", props)}
            nodes={nodes}
            edges={edges}
        >
            <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .05)" gap={8} size={2}/>
            <DFlowPanelSize/>
            <DFlowPanelLayout/>
            <DFlowValidation flowId={"gid://sagittarius/Flow/1"}/>
            <DFlowPanelControl flowId={flowId}/>
        </ReactFlow>
    )
}