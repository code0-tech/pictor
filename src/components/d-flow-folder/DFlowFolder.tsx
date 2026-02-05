"use client"

import "./DFlowFolder.style.scss"
import React from "react"
import {Code0Component, mergeCode0Props, useService, useStore} from "../../utils"
import {IconFile, IconFolderFilled, IconFolderOpen} from "@tabler/icons-react"
import type {Flow, FlowType, Namespace, NamespaceProject, Scalars} from "@code0-tech/sagittarius-graphql-types"
import {DFlowReactiveService} from "../d-flow"
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea"
import {Flex} from "../flex/Flex"
import {Text} from "../text/Text"
import {
    DFlowFolderContextMenu,
    DFlowFolderContextMenuGroupData,
    DFlowFolderContextMenuItemData
} from "./DFlowFolderContextMenu";
import {hashToColor} from "../d-flow/DFlow.util";
import {HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger} from "@radix-ui/react-hover-card";


export interface DFlowFolderProps {
    activeFlowId: Scalars["FlowID"]["output"]
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
    onRename?: (contextData: DFlowFolderContextMenuGroupData | DFlowFolderContextMenuItemData) => void
    onDelete?: (contextData: DFlowFolderContextMenuGroupData | DFlowFolderContextMenuItemData) => void
    onCreate?: (type: FlowType['id']) => void
    onSelect?: (flow: Flow) => void
}

export type DFlowFolderHandle = {
    openAll: () => void
    closeAll: () => void
    openActivePath: () => void
}

type OpenMode = "default" | "allOpen" | "allClosed" | "activePath"

export interface DFlowFolderGroupProps extends DFlowFolderProps, Omit<Code0Component<HTMLDivElement>, "onSelect"> {
    name: string
    children: React.ReactElement<DFlowFolderItemProps> | React.ReactElement<DFlowFolderItemProps>[] | React.ReactElement<DFlowFolderGroupProps> | React.ReactElement<DFlowFolderGroupProps>[]
    defaultOpen?: boolean
    flows: Flow[]
}

export interface DFlowFolderItemProps extends DFlowFolderProps, Omit<Code0Component<HTMLDivElement>, "onSelect"> {
    name: string
    path: string
    active?: boolean
    flow: Flow
}

export const DFlowFolder = React.forwardRef<DFlowFolderHandle, DFlowFolderProps>((props, ref) => {

    const {activeFlowId, namespaceId, projectId} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    type TreeNode = {
        name: string
        path: string
        children: Record<string, TreeNode>
        flow?: Flow
    }

    const normalizePath = (p: string) => {
        const trimmed = p.replace(/\/+$/g, "")

        return trimmed.split("/").filter((seg, idx) => {
            return idx === 0 || seg.length > 0
        })
    }

    const flows = React.useMemo<Flow[]>(() => {
        const raw = (flowService.values?.({namespaceId, projectId}) ?? []) as Flow[]
        return raw.filter(f => !!f?.name)
    }, [flowStore])

    const activePathSegments = React.useMemo<string[]>(() => {
        const active = flows.find(f => f.id === activeFlowId)
        if (!active?.name) return []
        return normalizePath(active.name)
    }, [flows, activeFlowId])

    const tree = React.useMemo<TreeNode>(() => {
        const root: TreeNode = {name: "", path: "", children: {}}
        for (const flow of flows) {
            const segs = normalizePath(flow.name as string)
            if (segs.length === 0) continue

            let cur = root
            let acc = ""
            for (let i = 0; i < segs.length; i++) {
                const seg = segs[i]
                // Behandle führenden leeren String (von führendem /) speziell
                if (i === 0 && seg === "") {
                    acc = "/"
                    // Erstelle Root-Level Ordner für führenden Slash
                    if (!cur.children["/"]) {
                        cur.children["/"] = {
                            name: "/",
                            path: "/",
                            children: {}
                        }
                    }
                    cur = cur.children["/"]
                    continue
                }

                acc = acc === "/" ? `/${seg}` : (acc ? `${acc}/${seg}` : seg)

                if (i === segs.length - 1) {
                    // leaf (Flow)
                    if (!cur.children[seg]) {
                        cur.children[seg] = {
                            name: seg,
                            path: acc,
                            children: {},
                            flow
                        }
                    } else {
                        // falls es bereits einen Knoten gibt, hänge Flow an
                        cur.children[seg].flow = flow
                    }
                } else {
                    // folder
                    if (!cur.children[seg]) {
                        cur.children[seg] = {
                            name: seg,
                            path: acc,
                            children: {}
                        }
                    }
                    cur = cur.children[seg]
                }
            }
        }
        return root
    }, [flows])

    const isPrefixOfActive = React.useCallback((nodePath: string) => {
        if (!nodePath) return false
        const segs = nodePath.split("/").filter(Boolean)
        return segs.every((s, i) => activePathSegments[i] === s)
    }, [activePathSegments])

    const [openMode, setOpenMode] = React.useState<OpenMode>("default")
    const [resetEpoch, setResetEpoch] = React.useState(0)

    const openAll = React.useCallback(() => {
        setOpenMode("allOpen")
        setResetEpoch(v => v + 1)
    }, [])

    const closeAll = React.useCallback(() => {
        setOpenMode("allClosed")
        setResetEpoch(v => v + 1)
    }, [])

    const openActivePath = React.useCallback(() => {
        setOpenMode("activePath")
        setResetEpoch(v => v + 1)
    }, [])

    React.useImperativeHandle(ref, () => ({
        openAll,
        closeAll,
        openActivePath
    }), [openAll, closeAll, openActivePath])

    const computeDefaultOpen = React.useCallback((folderPath: string) => {
        if (openMode === "allOpen") return true
        if (openMode === "allClosed") return false
        return isPrefixOfActive(folderPath)
    }, [isPrefixOfActive, openMode])

    const renderChildren = React.useCallback((childrenMap: Record<string, TreeNode>) => {
        const nodes = Object.values(childrenMap)

        const folders = nodes.filter(n => !n.flow)
        const items = nodes.filter(n => !!n.flow)

        folders.sort((a, b) => a.name.localeCompare(b.name))
        items.sort((a, b) => a.name.localeCompare(b.name))

        return (
            <>
                {folders.map(folder => (
                    <DFlowFolderGroup
                        key={`${folder.path}-${resetEpoch}`}
                        name={folder.name}
                        flows={Object.values(folder.children).map(value => value.flow!!)}
                        defaultOpen={computeDefaultOpen(folder.path)}
                        {...props}
                    >
                        {renderChildren(folder.children)}
                    </DFlowFolderGroup>
                ))}
                {items.map(item => (
                    <DFlowFolderItem
                        key={item.flow!.id ?? item.path}
                        name={item.name}
                        path={item.path}
                        flow={item.flow!}
                        active={item.flow!.id === activeFlowId}
                        data-flow-id={item.flow!.id ?? undefined}
                        {...props}
                    />
                ))}
            </>
        )
    }, [activeFlowId, computeDefaultOpen, resetEpoch])

    return (
        <ScrollArea h={"100%"} type={"scroll"}>
            <ScrollAreaViewport asChild>
                <DFlowFolderContextMenu {...props}>
                    <div className="d-folder__root">
                        {renderChildren(tree.children)}
                    </div>
                </DFlowFolderContextMenu>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>
    )

})

export const DFlowFolderGroup: React.FC<DFlowFolderGroupProps> = (props) => {

    const {
        name,
        flows,
        defaultOpen = false,
        children,
        onCreate,
        onDelete,
        onRename,
        activeFlowId,
        namespaceId,
        projectId,
        ...code0Props
    } = props
    const [open, setOpen] = React.useState(defaultOpen)
    const contextMenuProps = {onCreate, onDelete, onRename, activeFlowId, namespaceId, projectId}

    return <>
        <DFlowFolderContextMenu contextData={{
            name: name,
            flow: flows,
            type: "folder"
        }} {...contextMenuProps}>
            <div onClick={() => setOpen(prevState => !prevState)} {...mergeCode0Props(`d-folder`, code0Props)}>
                <Flex align={"center"} justify={"space-between"} style={{gap: "0.35rem"}}>
                    {open ? <IconFolderOpen size={12}/> : <IconFolderFilled size={12}/>}
                    <Text>{name}</Text>
                </Flex>
            </div>
        </DFlowFolderContextMenu>
        <div className={"d-folder__content"}>
            {open ? children : null}
        </div>
    </>
}

export const DFlowFolderItem: React.FC<DFlowFolderItemProps> = (props) => {

    const {
        name,
        path,
        flow,
        onSelect,
        active,
        onCreate,
        onDelete,
        onRename,
        activeFlowId,
        namespaceId,
        projectId,
        ...code0Props
    } = props

    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const [text, setText] = React.useState(name)

    React.useEffect(() => {

        const resizeObserverWrapper = new ResizeObserver(([entry]) => {
            const wrapperWidth = entry.contentRect.width
            const newText = truncateText(name, wrapperWidth)
            setText(newText)
        })


        if (wrapperRef.current) resizeObserverWrapper.observe(wrapperRef.current)
        return () => {
            resizeObserverWrapper.disconnect()
        };
    }, [wrapperRef])


    const contextMenuProps = {onCreate, onDelete, onRename, activeFlowId, namespaceId, projectId}

    return <DFlowFolderContextMenu contextData={{
        name: path,
        flow: flow,
        type: "item"
    }} {...contextMenuProps}>
        <div>
            <HoverCard open={props.name === text ? false : undefined} openDelay={500} closeDelay={0}>
                <HoverCardTrigger asChild>
                    <div
                        ref={wrapperRef} {...mergeCode0Props(`d-folder__item ${active ? "d-folder__item--active" : ""}`, code0Props)}
                        onClick={() => onSelect?.(flow)}>
                        <Flex align={"center"} style={{gap: "0.35rem"}}>
                            <IconFile color={hashToColor(path + name)} size={12}/>
                            <Text>{text}</Text>
                        </Flex>
                    </div>
                </HoverCardTrigger>
                <HoverCardPortal>
                    <HoverCardContent side={"top"} align={"start"} sideOffset={-26}>
                        <div {...mergeCode0Props(`d-folder__item-hover-card`, code0Props)}
                             onClick={() => onSelect?.(flow)} style={{padding: "0.35rem 0.7rem"}}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconFile color={hashToColor(path + name)} size={12}/>
                                <Text>{props.name}</Text>
                            </Flex>
                        </div>
                    </HoverCardContent>
                </HoverCardPortal>
            </HoverCard>
        </div>
    </DFlowFolderContextMenu>

}


type TruncateMode = "start" | "middle" | "end";

export function truncateText(
    value: string,
    wrapperWidth: number,
    mode: TruncateMode = "middle",
    ellipsis = "…"
): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    ctx.font = "400 16px Inter, sans-serif";
    const letterSpacing = -1.9;

    const measure = (text: string) =>
        ctx.measureText(text).width + (text.length - 1) * letterSpacing;

    if (measure(value) <= wrapperWidth) return value;

    let low = 0;
    let high = value.length;
    let best = ellipsis;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        let candidate: string;

        if (mode === "end") {
            candidate = value.slice(0, mid) + ellipsis;
        } else if (mode === "start") {
            candidate = ellipsis + value.slice(value.length - mid);
        } else {
            const half = Math.floor(mid / 2);
            candidate = value.slice(0, half) + ellipsis + value.slice(value.length - half);
        }

        const width = measure(candidate);

        if (width > wrapperWidth - 8) {
            high = mid - 1;
        } else {
            best = candidate;
            low = mid + 1;
        }
    }

    return best;
}
