import "./DFolder.style.scss"
import React from "react";
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";
import {IconChevronDown, IconChevronRight, IconFolder} from "@tabler/icons-react";

export interface DFolderProps extends Code0Component<HTMLDivElement> {
    name: string
    children: React.ReactElement<DFolderItemProps> | React.ReactElement<DFolderItemProps>[] | React.ReactElement<DFolderProps> | React.ReactElement<DFolderProps>[]
    //defaults to false
    defaultOpen?: boolean
}

export interface DFolderItemProps extends Code0Component<HTMLDivElement> {
    name: string
    icon?: React.ReactNode
    //defaults to false
    active?: boolean
}

const DFolder: React.FC<DFolderProps> = (props) => {

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

const DFolderItem: React.FC<DFolderItemProps> = (props) => {

    const {name, icon, active, ...rest} = props

    return <div {...mergeCode0Props(`d-folder-item ${active ? "d-folder-item--active" : ""}`, rest)}>
        {icon? <span className={"d-folder-item__icon"}>{icon}</span> : null}
        <span className={"d-folder-item__name"}>{name}</span>
    </div>
}

export default Object.assign(DFolder, {
    Item: DFolderItem
})

