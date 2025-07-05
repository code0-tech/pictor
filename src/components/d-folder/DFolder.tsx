"use client"

import "./DFolder.style.scss"
import React, {useEffect} from "react";
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";
import {IconChevronDown, IconChevronRight, IconFolder} from "@tabler/icons-react";

// -1 && -3 means open all folders
// -2 && -4 means close all folders
export type DFolderControls = -1 | -2 | -3 | -4 | undefined

export interface DFolderProps extends Omit<Code0Component<HTMLDivElement>, "controls"> {
    name: string
    children: React.ReactElement<DFolderItemProps> | React.ReactElement<DFolderItemProps>[] | React.ReactElement<DFolderProps> | React.ReactElement<DFolderProps>[]
    //defaults to false
    defaultOpen?: boolean
    controls?: DFolderControls
}

export interface DFolderItemProps extends Code0Component<HTMLDivElement> {
    name: string
    icon?: React.ReactNode
    //defaults to false
    active?: boolean
}

export const useFolderControls = (): [DFolderControls, () => void, () => void] => {

    const [folderControlState, setFolderControlState] = React.useState<DFolderControls>(undefined)
    const openAll = () => setFolderControlState(prevState => prevState === -1 ? -3 : -1)
    const closeAll = () => setFolderControlState(prevState => prevState === -2 ? -4 : -2)

    return [folderControlState, openAll, closeAll]
}

const DFolder: React.FC<DFolderProps> = (props) => {

    const {name, defaultOpen = false, controls, children, ...rest} = props
    const [open, setOpen] = React.useState(defaultOpen);

    useEffect(() => {
        if (!controls) return
        if (controls === -1 || controls === -3) setOpen(true)
        else if (controls === -2 || controls === -4) setOpen(false)
    }, [controls]);

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

const DFolderItem: React.FC<DFolderItemProps> = (props) => {

    const {name, icon, active, ...rest} = props

    return <div {...mergeCode0Props(`d-folder__item ${active ? "d-folder__item--active" : ""}`, rest)}>
        {icon? <span className={"d-folder__item-icon"}>{icon}</span> : null}
        <span className={"d-folder__item-name"}>{name}</span>
    </div>
}

export default Object.assign(DFolder, {
    Item: DFolderItem
})

