"use client"

import "./DFlowFolder.style.scss"
import React from "react"
import {Code0Component} from "../../../utils/types"
import {mergeCode0Props} from "../../../utils/utils"
import {IconChevronDown, IconChevronRight, IconDots, IconFolder, IconFolderOpen} from "@tabler/icons-react"
import type {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {useService, useStore} from "../../../utils/contextStore"
import {DFlowReactiveService} from "../DFlow.service"
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../../scroll-area/ScrollArea"
import {FlowView} from "../DFlow.view"
import {Flex} from "../../flex/Flex"
import {Text} from "../../text/Text"
import {Button} from "../../button/Button"
import {ContextMenu, ContextMenuContent, ContextMenuPortal, ContextMenuTrigger} from "@radix-ui/react-context-menu";
import {MenuContent} from "../../menu/Menu";


export interface DFlowFolderProps {
    flowId: Scalars["FlowID"]["output"]
}

export interface DFlowFolderGroupProps extends Omit<Code0Component<HTMLDivElement>, "controls"> {
    name: string
    children: React.ReactElement<DFlowFolderItemProps> | React.ReactElement<DFlowFolderItemProps>[] | React.ReactElement<DFlowFolderGroupProps> | React.ReactElement<DFlowFolderGroupProps>[]
    //defaults to false
    defaultOpen?: boolean
}

export interface DFlowFolderItemProps extends Code0Component<HTMLDivElement> {
    name: string
    icon?: React.ReactNode
    //defaults to false
    active?: boolean
}

export const DFlowFolder: React.FC<DFlowFolderProps> = (props) => {

    const {flowId} = props

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    type TreeNode = {
        name: string
        path: string
        children: Record<string, TreeNode>
        flow?: FlowView
    }

    const normalizePath = (p: string) =>
        p.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean)

    const flows = React.useMemo<FlowView[]>(() => {
        const raw = (flowService.values?.() ?? []) as FlowView[]
        return raw.filter(f => !!f?.name)
    }, [flowStore])

    const activePathSegments = React.useMemo<string[]>(() => {
        const active = flows.find(f => f.id === flowId)
        if (!active?.name) return []
        return normalizePath(active.name)
    }, [flows, flowId])

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
                        key={folder.path}
                        name={folder.name}
                        defaultOpen={isPrefixOfActive(folder.path)}
                    >
                        {renderChildren(folder.children)}
                    </DFlowFolderGroup>
                ))}
                {items.map(item => (
                    <DFlowFolderItem
                        key={item.flow!.id ?? item.path}
                        name={item.name}
                        active={item.flow!.id === flowId}
                        data-flow-id={item.flow!.id ?? undefined}
                        title={item.flow!.name ?? undefined}
                    />
                ))}
            </>
        )
    }, [flowId, isPrefixOfActive])

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

}

export const DFlowFolderGroup: React.FC<DFlowFolderGroupProps> = (props) => {

    const {name, defaultOpen = false, children, ...rest} = props
    const [open, setOpen] = React.useState(defaultOpen)

    return <div>
        <div onDoubleClick={() => setOpen(prevState => !prevState)} {...mergeCode0Props(`d-folder`, rest)}>
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
                <Button p={"0"} variant={"none"} onClick={() => setOpen(prevState => !prevState)}>
                    {open ? <IconChevronDown size={12}/> : <IconChevronRight size={12}/>}
                </Button>
            </Flex>
        </div>
        <div className={"d-folder__content"}>
            {open ? children : null}
        </div>
    </div>
}

export const DFlowFolderItem: React.FC<DFlowFolderItemProps> = (props) => {

    const {name, icon, active, ...rest} = props

    return <ContextMenu>
        <ContextMenuTrigger asChild>
            <div {...mergeCode0Props(`d-folder__item ${active ? "d-folder__item--active" : ""}`, rest)}>
                {icon ? <span className={"d-folder__item-icon"}>{icon}</span> : null}
                <span className={"d-folder__item-name"}>{name}</span>
            </div>
        </ContextMenuTrigger>
        <ContextMenuPortal>
            <ContextMenuContent>
                <Text>sd</Text>
            </ContextMenuContent>
        </ContextMenuPortal>
    </ContextMenu>
}

