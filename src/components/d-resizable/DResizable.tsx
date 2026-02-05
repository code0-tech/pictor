"use client"

import * as React from "react"
import {Code0ComponentProps, Color} from "../../utils";
import {mergeCode0Props} from "../../utils";
import {Group, GroupProps, Panel, PanelProps, Separator, SeparatorProps} from "react-resizable-panels";
import "./DResizable.style.scss"

type DResizablePanelGroupProps = Code0ComponentProps & GroupProps
type DResizablePanelProps = Code0ComponentProps & PanelProps & {color?: Color}
type DResizableHandleProps = Code0ComponentProps & SeparatorProps

export const DResizablePanelGroup: React.FC<DResizablePanelGroupProps> = (props) => {
    return <Group
        data-slot="resizable-panel-group"
        {...(mergeCode0Props(`d-resizable`, props) as DResizablePanelGroupProps)}
    />

}

export const DResizablePanel: React.FC<DResizablePanelProps> = (props) => {
    return <Panel data-slot="resizable-panel" {...mergeCode0Props(`d-resizable__panel ${props.color ? `d-resizable__panel--${props.color ?? "primary"}` : ""}`, props)} />
}

export const DResizableHandle: React.FC<DResizableHandleProps> = (props) => {
    return <Separator
        data-slot="resizable-handle"
        {...mergeCode0Props("d-resizable__handle", props)}>
        <div className={"d-resizable__handle-bar"}/>
    </Separator>

}

