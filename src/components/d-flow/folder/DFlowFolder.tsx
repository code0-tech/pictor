"use client"

import "./DFlowFolder.style.scss"
import React from "react";
import {Code0Component} from "../../../utils/types";
import {mergeCode0Props} from "../../../utils/utils";
import {IconChevronDown, IconChevronRight, IconFolder} from "@tabler/icons-react";
import {Scalars} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../../utils/contextStore";
import {DFlowReactiveService} from "../DFlow.service";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../../scroll-area/ScrollArea";


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

    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)

    return <ScrollArea h={"100%"}>
        <ScrollAreaViewport>
            {flowService.values().map(flow => {
                return <></>
            })}
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation={"vertical"}>
            <ScrollAreaThumb/>
        </ScrollAreaScrollbar>
    </ScrollArea>

}

export const DFlowFolderGroup: React.FC<DFlowFolderGroupProps> = (props) => {

    const {name, defaultOpen = false, children, ...rest} = props
    const [open, setOpen] = React.useState(defaultOpen);

    return <div>
        <div onDoubleClick={() => setOpen(prevState => !prevState)} {...mergeCode0Props(`d-folder`, rest)}>
            <span onClick={() => setOpen(prevState => !prevState)} className={"d-folder__status"}>
                {open ? <IconChevronDown size={12}/> : <IconChevronRight size={12}/>}
            </span>
            <span className={"d-folder__icon"}><IconFolder size={12}/></span>
            <span className={"d-folder__name"}>{name}</span>
        </div>
        <div className={"d-folder__content"}>
            {open ? children : null}
        </div>
    </div>
}

export const DFlowFolderItem: React.FC<DFlowFolderItemProps> = (props) => {

    const {name, icon, active, ...rest} = props

    return <div {...mergeCode0Props(`d-folder__item ${active ? "d-folder__item--active" : ""}`, rest)}>
        {icon? <span className={"d-folder__item-icon"}>{icon}</span> : null}
        <span className={"d-folder__item-name"}>{name}</span>
    </div>
}

