"use client"

import "./DFlowFolder.style.scss"
import React from "react"
import {Code0Component, mergeCode0Props, useService, useStore} from "../../utils"
import {IconChevronDown, IconChevronRight, IconDots, IconFile, IconFolder, IconFolderOpen} from "@tabler/icons-react"
import type {Flow, FlowType, Scalars} from "@code0-tech/sagittarius-graphql-types"
import {DFlowReactiveService} from "../d-flow"
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea"
import {Flex} from "../flex/Flex"
import {Text} from "../text/Text"
import {Button} from "../button/Button"
import {DFlowFolderContextMenu} from "./DFlowFolderContextMenu";
import {md5} from "js-md5";


export interface DFlowFolderProps {
    activeFlowId: Scalars["FlowID"]["output"]
    onRename?: (flow: Flow, newName: string) => void
    onDelete?: (flow: Flow) => void
    onCreate?: (name: string, type: FlowType['id']) => void
}

export type DFlowFolderHandle = {
    openAll: () => void
    closeAll: () => void
    openActivePath: () => void
}

type OpenMode = "default" | "allOpen" | "allClosed" | "activePath"

export interface DFlowFolderGroupProps extends DFlowFolderProps, Omit<Code0Component<HTMLDivElement>, "controls"> {
    name: string
    children: React.ReactElement<DFlowFolderItemProps> | React.ReactElement<DFlowFolderItemProps>[] | React.ReactElement<DFlowFolderGroupProps> | React.ReactElement<DFlowFolderGroupProps>[]
    defaultOpen?: boolean
    flows: Flow[]
}

export interface DFlowFolderItemProps extends DFlowFolderProps, Code0Component<HTMLDivElement> {
    name: string
    path: string
    active?: boolean
    flow: Flow
}

export const DFlowFolder = React.forwardRef<DFlowFolderHandle, DFlowFolderProps>((props, ref) => {

    const {activeFlowId} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    type TreeNode = {
        name: string
        path: string
        children: Record<string, TreeNode>
        flow?: Flow
    }

    const normalizePath = (p: string) =>
        p.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean)

    const flows = React.useMemo<Flow[]>(() => {
        const raw = (flowService.values?.() ?? []) as Flow[]
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
                acc = acc ? `${acc}/${seg}` : seg

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
        <ScrollArea h={"100%"}>
            <ScrollAreaViewport>
                <div className="d-folder__root">
                    {renderChildren(tree.children)}
                </div>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>
    )

})

export const DFlowFolderGroup: React.FC<DFlowFolderGroupProps> = (props) => {

    const {name, flows, defaultOpen = false, children, ...rest} = props
    const [open, setOpen] = React.useState(defaultOpen)

    return <>
        <DFlowFolderContextMenu contextData={{
            name: name,
            flows: flows,
            type: "group"
        }} {...rest}>
            <div onClick={() => setOpen(prevState => !prevState)} {...mergeCode0Props(`d-folder`, rest)}>
                <Flex align={"center"} style={{gap: "0.35rem"}}>
                    <span className={"d-folder__icon"}>
                        {open ? <IconFolderOpen size={12}/> : <IconFolder size={12}/>}
                    </span>
                    <Text>{name}</Text>
                </Flex>
                <Flex align={"center"} style={{gap: "0.35rem"}}>
                    <Button p={"0"} variant={"none"}>
                        <IconDots size={12}/>
                    </Button>
                    <Button p={"0"} variant={"none"}>
                        {open ? <IconChevronDown size={12}/> : <IconChevronRight size={12}/>}
                    </Button>
                </Flex>
            </div>
        </DFlowFolderContextMenu>
        <div className={"d-folder__content"}>
            {open ? children : null}
        </div>
    </>
}

export const DFlowFolderItem: React.FC<DFlowFolderItemProps> = (props) => {

    const {name, path, flow, active, ...rest} = props

    const colorHash = md5(path + name)
    const hashToHue = (md5: string): number => {
        // nimm z.B. 8 Hex-Zeichen = 32 Bit
        const int = parseInt(md5.slice(0, 8), 16)
        return int % 360
    }

    return <DFlowFolderContextMenu contextData={{
        name: path,
        flow: flow,
        type: "item"
    }} {...rest}>
        <div {...mergeCode0Props(`d-folder__item ${active ? "d-folder__item--active" : ""}`, rest)}>
            <IconFile color={`hsl(${hashToHue(colorHash)}, 100%, 72%)`} size={12}/>
            <Text>{name}</Text>
        </div>
    </DFlowFolderContextMenu>

}
