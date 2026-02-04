import {Code0ComponentProps, mergeCode0Props} from "../../utils";
import {
    Background,
    BackgroundVariant,
    Edge,
    Node,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useUpdateNodeInternals
} from "@xyflow/react";
import React from "react";
import '@xyflow/react/dist/style.css';
import "./DFlow.style.scss"
import {DFlowNodeDefaultCard} from "../d-flow-node/DFlowNodeDefaultCard";
import {DFlowNodeGroupCard} from "../d-flow-node/DFlowNodeGroupCard";
import {DFlowNodeTriggerCard} from "../d-flow-node/DFlowNodeTriggerCard";
import {DFlowEdge} from "./DFlowEdge";
import {DFlowPanelSize} from "../d-flow-panel";
import {DFlowValidation} from "../d-flow-validation";
import {Flow, type Namespace, type NamespaceProject} from "@code0-tech/sagittarius-graphql-types";
import {useFlowNodes} from "./DFlow.nodes.hook";
import {useFlowEdges} from "./DFlow.edges.hook";
import {DFlowPanelControl} from "../d-flow-panel";
import {DFlowPanelLayout} from "../d-flow-panel";
import {DFlowPanelUpdate} from "../d-flow-panel/DFlowPanelUpdate";

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
    if (!dirtyIds || dirtyIds.size === 0) return { nodes }

    /* Konstanten */
    const V = 50;          // vertical gap Node ↕ Node
    const H = 50;          // horizontal gap Parent → Param
    const PAD = 16;        // inner padding einer Group (links+rechts / oben+unten)
    const EPS = 0.25;      // Toleranz gegen Rundungsdrift

    // Wir iterieren, bis Group-Maße stabil sind
    let pass = 0
    let changed = false

    // ----------------------------
    // 1) Relationen einmalig ermitteln
    // ----------------------------
    const rfKidIds = new Map<string, string[]>()
    const paramIds = new Map<string, string[]>()

    for (const n of nodes) {
        const link = (n.data as any)?.parentNodeId
        if (link) {
            const arr = paramIds.get(link) ?? []
            arr.push(n.id)
            paramIds.set(link, arr)
        }
        if (n.parentId && !link) {
            const arr = rfKidIds.get(n.parentId) ?? []
            arr.push(n.id)
            rfKidIds.set(n.parentId, arr)
        }
    }

    const byId = new Map(nodes.map(n => [n.id, n] as const))

    const rfKids = new Map<string, Node[]>()
    for (const [k, ids] of rfKidIds) {
        const arr: Node[] = new Array(ids.length)
        for (let i = 0; i < ids.length; i++) arr[i] = byId.get(ids[i])!
        rfKids.set(k, arr)
    }

    const params = new Map<string, Node[]>()
    for (const [k, ids] of paramIds) {
        const arr: Node[] = new Array(ids.length)
        for (let i = 0; i < ids.length; i++) arr[i] = byId.get(ids[i])!
        params.set(k, arr)
    }

    type Size = { w: number; h: number }
    type Pos = { x: number; y: number }

    // ----------------------------
    // 2) Working state (nur Daten, KEINE Node-Mutationen)
    // ----------------------------
    // Positionen (Top-Left, RF-Koordinaten, relativ zu Parent falls parentId)
    const posTL = new Map<string, Pos>()

    // Group-Measured/Style (width/height) werden im Bounding geändert
    // -> diese Maps repräsentieren den "aktuellen" Stand über Passes hinweg
    const styleWH = new Map<string, { width: number; height: number }>()
    const measuredWH = new Map<string, { width: number; height: number }>()

    // baseSizes als Startpunkt (non-group) + wird für groups nach Bounding aktualisiert
    const baseSizes = new Map<string, Size>()
    for (const n of nodes) {
        const styleW = typeof n.style?.width === "number" ? (n.style.width as number) : undefined
        const styleH = typeof n.style?.height === "number" ? (n.style.height as number) : undefined
        const mw = n.measured?.width && n.measured.width > 0 ? n.measured.width : undefined
        const mh = n.measured?.height && n.measured.height > 0 ? n.measured.height : undefined
        baseSizes.set(n.id, { w: styleW ?? mw ?? 200, h: styleH ?? mh ?? 80 })
    }

    const getStyleW = (n: Node) => styleWH.get(n.id)?.width
    const getStyleH = (n: Node) => styleWH.get(n.id)?.height

    const sizeCache = new Map<string, Size>()
    const size = (n: Node): Size => {
        const cached = sizeCache.get(n.id)
        if (cached) return cached

        // non-group: aus baseSizes
        if (n.type !== "group") {
            const s = baseSizes.get(n.id)!
            sizeCache.set(n.id, s)
            return s
        }

        // group: wenn width/height explizit gesetzt (aus styleWH), dann das nehmen
        const sw = getStyleW(n)
        const sh = getStyleH(n)
        if (sw !== undefined && sh !== undefined) {
            const s = { w: sw, h: sh }
            sizeCache.set(n.id, s)
            return s
        }

        // sonst aus Kindern ableiten
        const kids = rfKids.get(n.id) ?? []
        let stackH = 0
        let wMax = 0
        let count = 0

        for (const k of kids) {
            const ks = size(k)
            stackH += ks.h
            if (ks.w > wMax) wMax = ks.w
            count++
        }
        stackH += V * Math.max(0, count - 1)

        const g = { w: wMax + 2 * PAD, h: (count ? stackH : 0) + 2 * PAD }
        sizeCache.set(n.id, g)
        return g
    }

    // ----------------------------
    // 3) Layout-Iteration (wie bisher), nur dass wir am Ende posTL/styleWH/measuredWH updaten
    // ----------------------------
    do {
        changed = false
        pass++

        sizeCache.clear()
        for (const n of nodes) size(n)

        // relatives Layout (Center in globalen Koordinaten)
        const relCenter = new Map<string, Pos>()

        // Unterkante je rechter Spalten-"Band", damit Parameter nicht kollidieren
        const columnBottom = new Map<number, number>()
        const colKey = (x: number) => Math.round(x / 10)

        const layoutIter = (root: Node, cx: number, cy: number): number => {
            type Frame = {
                node: Node
                cx: number
                cy: number
                phase: number
                w?: number
                h?: number
                right?: Node[]
                rightIndex?: number
                py?: number
                rightBottom?: number
                childKey?: number
                childPs?: Size
                lastChildBottom?: number

                gParams?: Node[]
                gSizes?: Size[]
                gIndex?: number
                gx?: number
                gy?: number
                rowBottom?: number

                kids?: Node[]
                kidIndex?: number
                curY?: number
                bottom?: number
            }

            const stack: Frame[] = [{ node: root, cx, cy, phase: 0 }]
            let returnBottom = 0

            while (stack.length) {
                const f = stack[stack.length - 1]
                switch (f.phase) {
                    case 0: {
                        relCenter.set(f.node.id, { x: f.cx, y: f.cy })
                        const { w, h } = size(f.node)
                        f.w = w
                        f.h = h

                        const paramsOf = params.get(f.node.id) ?? []
                        const right: Node[] = []
                        const gParams: Node[] = []
                        for (const p of paramsOf) {
                            if (p.type === "group") gParams.push(p)
                            else right.push(p)
                        }
                        right.sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex))
                        gParams.sort((a, b) => (+(a.data as any)?.paramIndex) - (+(b.data as any)?.paramIndex))

                        f.right = right
                        f.gParams = gParams

                        let total = 0
                        for (const p of right) total += size(p).h
                        total += V * Math.max(0, right.length - 1)

                        f.py = f.cy - total / 2
                        f.rightBottom = f.cy + h / 2
                        f.rightIndex = 0
                        f.phase = 1
                        break
                    }

                    case 1: {
                        if (f.rightIndex! < f.right!.length) {
                            const p = f.right![f.rightIndex!]
                            const ps = size(p)
                            const px = f.cx + f.w! / 2 + H + ps.w / 2
                            let pcy = f.py! + ps.h / 2

                            const key = colKey(px)
                            const occ = columnBottom.get(key) ?? Number.NEGATIVE_INFINITY
                            const minTop = occ + V
                            const desiredTop = pcy - ps.h / 2

                            if (desiredTop < minTop) {
                                pcy = minTop + ps.h / 2
                                f.py = pcy - ps.h / 2
                            }

                            f.childKey = key
                            f.childPs = ps
                            stack.push({ node: p, cx: px, cy: pcy, phase: 0 })
                            f.phase = 10
                        } else {
                            f.bottom = Math.max(f.cy + f.h! / 2, f.rightBottom!)
                            f.phase = 2
                        }
                        break
                    }

                    case 10: {
                        const subBottom = f.lastChildBottom!
                        columnBottom.set(
                            f.childKey!,
                            Math.max(columnBottom.get(f.childKey!) ?? Number.NEGATIVE_INFINITY, subBottom)
                        )
                        f.rightBottom = Math.max(f.rightBottom!, subBottom)
                        f.py = Math.max(f.py! + f.childPs!.h + V, subBottom + V)
                        f.rightIndex!++
                        f.phase = 1
                        break
                    }

                    case 2: {
                        if (f.gParams && f.gParams.length) {
                            const gSizes: Size[] = []
                            let rowW = 0
                            for (const g of f.gParams) {
                                const gs = size(g)
                                gSizes.push(gs)
                                rowW += gs.w
                            }
                            rowW += H * (f.gParams.length - 1)

                            f.gSizes = gSizes
                            f.gx = f.cx - rowW / 2
                            f.gy = f.bottom! + V
                            f.rowBottom = f.bottom
                            f.gIndex = 0
                            f.phase = 3
                        } else {
                            f.phase = 4
                        }
                        break
                    }

                    case 3: {
                        if (f.gIndex! < f.gParams!.length) {
                            const g = f.gParams![f.gIndex!]
                            const gs = f.gSizes![f.gIndex!]
                            const gcx = f.gx! + gs.w / 2
                            const gcy = f.gy! + gs.h / 2
                            f.gx! += gs.w + H

                            stack.push({ node: g, cx: gcx, cy: gcy, phase: 0 })
                            f.childPs = gs
                            f.phase = 30
                        } else {
                            f.bottom = f.rowBottom
                            f.phase = 4
                        }
                        break
                    }

                    case 30: {
                        const subBottom = f.lastChildBottom!
                        f.rowBottom = Math.max(f.rowBottom!, subBottom)
                        f.gIndex!++
                        f.phase = 3
                        break
                    }

                    case 4: {
                        if (f.node.type === "group") {
                            const kidsAll = rfKids.get(f.node.id) ?? []
                            const kids: Node[] = []
                            for (const k of kidsAll) {
                                if (!(k.data as any)?.parentNodeId) kids.push(k)
                            }
                            f.kids = kids
                            f.kidIndex = 0
                            f.curY = f.cy - f.h! / 2 + PAD
                            f.phase = 5
                        } else {
                            f.phase = 6
                        }
                        break
                    }

                    case 5: {
                        if (f.kidIndex! < f.kids!.length) {
                            const k = f.kids![f.kidIndex!]
                            const ks = size(k)
                            const ky = f.curY! + ks.h / 2

                            stack.push({ node: k, cx: f.cx, cy: ky, phase: 0 })
                            f.childPs = ks
                            f.phase = 50
                        } else {
                            const contentBottom = f.curY! - V
                            f.bottom = Math.max(f.bottom!, contentBottom + PAD)
                            f.phase = 6
                        }
                        break
                    }

                    case 50: {
                        const subBottom = f.lastChildBottom!
                        f.curY = subBottom + V
                        f.kidIndex!++
                        f.phase = 5
                        break
                    }

                    case 6: {
                        const finished = stack.pop()!
                        if (stack.length) {
                            stack[stack.length - 1].lastChildBottom = finished.bottom
                        } else {
                            returnBottom = finished.bottom!
                        }
                        break
                    }
                }
            }

            return returnBottom
        }

        // Root-Nodes stapeln
        let yCursor = 0
        for (const r of nodes) {
            if (!(r.data as any)?.parentNodeId && !r.parentId) {
                const b = layoutIter(r, 0, yCursor + size(r).h / 2)
                yCursor = b + V
            }
        }

        // rel (Center) → absTL_initial (global Top-Left)
        const absTL_initial = new Map<string, Pos>()
        for (const n of nodes) {
            const { w, h } = size(n)
            const c = relCenter.get(n.id)!
            absTL_initial.set(n.id, { x: c.x - w / 2, y: c.y - h / 2 })
        }

        // initial posTL setzen (in RF-Koordinaten, relativ zu Parent)
        for (const n of nodes) {
            const tl = absTL_initial.get(n.id)!
            let px = tl.x
            let py = tl.y

            if (n.parentId) {
                const pTL = absTL_initial.get(n.parentId)!
                px -= pTL.x
                py -= pTL.y
            }

            const prev = posTL.get(n.id)
            if (!prev || Math.abs(prev.x - px) > EPS || Math.abs(prev.y - py) > EPS) {
                posTL.set(n.id, { x: px, y: py })
                changed = true
            }
        }

        // Bounding-Korrektur jeder Group
        const depth = (g: Node) => {
            let d = 0
            let p: Node | undefined = g
            while (p?.parentId) {
                d++
                p = byId.get(p.parentId)
                if (!p) break
            }
            return d
        }

        const groups: Node[] = []
        for (const n of nodes) if (n.type === "group") groups.push(n)
        groups.sort((a, b) => depth(b) - depth(a))

        const childSize = (n: Node): Size => {
            const sw = typeof n.style?.width === "number" ? (n.style.width as number) : undefined
            const sh = typeof n.style?.height === "number" ? (n.style.height as number) : undefined
            const s = baseSizes.get(n.id)!
            return { w: sw ?? s.w, h: sh ?? s.h }
        }

        for (const g of groups) {
            const direct: Node[] = []
            for (const k of nodes) {
                if (k.parentId === g.id) direct.push(k)
            }

            if (!direct.length) {
                // minimal group size
                const gw = getStyleW(g) ?? (typeof g.style?.width === "number" ? (g.style.width as number) : 2 * PAD)
                const gh = getStyleH(g) ?? (typeof g.style?.height === "number" ? (g.style.height as number) : 2 * PAD)
                styleWH.set(g.id, { width: gw, height: gh })
                measuredWH.set(g.id, { width: gw, height: gh })
                baseSizes.set(g.id, { w: gw, h: gh })
                continue
            }

            let minX = Number.POSITIVE_INFINITY
            let minY = Number.POSITIVE_INFINITY
            let maxX = Number.NEGATIVE_INFINITY
            let maxY = Number.NEGATIVE_INFINITY

            for (const k of direct) {
                const ks = childSize(k)
                const p = posTL.get(k.id)!
                if (p.x < minX) minX = p.x
                if (p.y < minY) minY = p.y
                if (p.x + ks.w > maxX) maxX = p.x + ks.w
                if (p.y + ks.h > maxY) maxY = p.y + ks.h
            }

            const dx = minX - PAD
            const dy = minY - PAD

            if (Math.abs(dx) > EPS || Math.abs(dy) > EPS) {
                for (const k of direct) {
                    const p = posTL.get(k.id)!
                    const nx = p.x - dx
                    const ny = p.y - dy

                    if (Math.abs(p.x - nx) > EPS || Math.abs(p.y - ny) > EPS) {
                        posTL.set(k.id, { x: nx, y: ny })
                        changed = true
                    }
                }
            }

            const newW = (maxX - minX) + 2 * PAD
            const newH = (maxY - minY) + 2 * PAD

            const oldW = getStyleW(g) ?? (typeof g.style?.width === "number" ? (g.style.width as number) : size(g).w)
            const oldH = getStyleH(g) ?? (typeof g.style?.height === "number" ? (g.style.height as number) : size(g).h)

            if (Math.abs(newW - oldW) > EPS || Math.abs(newH - oldH) > EPS) changed = true

            styleWH.set(g.id, { width: newW, height: newH })
            measuredWH.set(g.id, { width: newW, height: newH })
            baseSizes.set(g.id, { w: newW, h: newH })
        }

        // Größen-Cache invalidieren (Group-Styles haben sich ggf. geändert)
        sizeCache.clear()
        for (const n of nodes) size(n)

        // absTL nach Bounding mit NEUEN Größen
        const absTL_after = new Map<string, Pos>()
        const absCenterAfter = new Map<string, Pos>()
        for (const n of nodes) {
            const s = size(n)
            const c = relCenter.get(n.id)!
            absCenterAfter.set(n.id, c)
            absTL_after.set(n.id, { x: c.x - s.w / 2, y: c.y - s.h / 2 })
        }

        // Param-Group-Row nach Bounding sauber zentrieren
        for (const parent of nodes) {
            const pGroups: Node[] = []
            const paramList = params.get(parent.id) ?? []
            for (const p of paramList) if (p.type === "group") pGroups.push(p)
            if (!pGroups.length) continue

            const ordered = pGroups.slice().sort((a, b) =>
                (+((a.data as any)?.paramIndex) || 0) - (+((b.data as any)?.paramIndex) || 0)
            )

            const widths: number[] = []
            for (const g of ordered) {
                const sw = getStyleW(g) ?? (typeof g.style?.width === "number" ? (g.style.width as number) : undefined)
                widths.push(sw ?? size(g).w)
            }

            let rowW = 0
            for (const w of widths) rowW += w
            rowW += H * (ordered.length - 1)

            const pCenterX = absCenterAfter.get(parent.id)!.x
            let gx = pCenterX - rowW / 2

            for (let i = 0; i < ordered.length; i++) {
                const g = ordered[i]
                const containerTL = g.parentId ? absTL_after.get(g.parentId)! : { x: 0, y: 0 }
                const cur = posTL.get(g.id)!
                const nx = gx - containerTL.x
                const ny = cur.y

                if (Math.abs(cur.x - nx) > EPS || Math.abs(cur.y - ny) > EPS) {
                    posTL.set(g.id, { x: nx, y: ny })
                    changed = true
                }
                gx += widths[i] + H
            }
        }

    } while (changed && pass < 5)

    // ----------------------------
    // 4) Output: Structural Sharing (nur wirklich geänderte Nodes neu bauen)
    // ----------------------------
    const out = nodes.map((n) => {
        const nextP = posTL.get(n.id)
        const nextM = measuredWH.get(n.id)
        const nextS = styleWH.get(n.id)

        let isChanged = false

        if (nextP) {
            const op = n.position ?? { x: 0, y: 0 }
            if (Math.abs(op.x - nextP.x) > EPS || Math.abs(op.y - nextP.y) > EPS) isChanged = true
        }

        if (nextM) {
            const om = n.measured ?? ({ width: 0, height: 0 } as any)
            if (Math.abs((om as any).width - nextM.width) > EPS || Math.abs((om as any).height - nextM.height) > EPS) isChanged = true
        }

        if (nextS) {
            const ow = typeof (n.style as any)?.width === "number" ? (n.style as any).width : undefined
            const oh = typeof (n.style as any)?.height === "number" ? (n.style as any).height : undefined
            if (ow !== nextS.width || oh !== nextS.height) isChanged = true
        }

        if (!isChanged) return n

        return {
            ...n,
            position: nextP ?? n.position,
            measured: nextM ? ({ ...(n.measured as any), width: nextM.width, height: nextM.height } as any) : n.measured,
            style: nextS
                ? ({ ...(n.style as any), width: nextS.width, height: nextS.height } as any)
                : n.style,
        } as Node
    })

    return { nodes: out }
}

const getCachedLayoutElements = React.cache(getLayoutElements)

export interface DFlowProps extends Code0ComponentProps {
    flowId: Flow['id']
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
}

export const DFlow: React.FC<DFlowProps> = (props) => {
    return <ReactFlowProvider>
        <InternalDFlow {...props}/>
    </ReactFlowProvider>
}

const InternalDFlow: React.FC<DFlowProps> = (props) => {

    const {flowId, namespaceId, projectId} = props
    const nodeTypes = React.useMemo(() => ({
        default: DFlowNodeDefaultCard,
        group: DFlowNodeGroupCard,
        trigger: DFlowNodeTriggerCard,
    }), [])

    const edgeTypes = React.useMemo(() => ({
        default: DFlowEdge,
    }), [])

    const initialNodes = useFlowNodes(flowId, namespaceId, projectId)
    const initialEdges = useFlowEdges(flowId, namespaceId, projectId)
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
            {...mergeCode0Props("flow", props)}
            proOptions={{hideAttribution: true}}
            nodes={nodes}
            edges={edges}
        >
            <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .05)" gap={8} size={2}/>
            <DFlowPanelSize/>
            <DFlowPanelLayout/>
            <DFlowValidation flowId={"gid://sagittarius/Flow/1"}/>
            <DFlowPanelControl flowId={flowId}/>
            <DFlowPanelUpdate flowId={flowId}/>
        </ReactFlow>
    )
}