"use client"

import * as React from "react"
import {Code0ComponentProps, Color} from "../../utils";
import {mergeCode0Props} from "../../utils";
import {Group, GroupProps, Panel, PanelProps, Separator, SeparatorProps} from "react-resizable-panels";
import "./Resizable.style.scss"

type ResizablePanelGroupProps = Code0ComponentProps & GroupProps
type ResizablePanelProps = Code0ComponentProps & PanelProps & {color?: Color}
type ResizableHandleProps = Code0ComponentProps & SeparatorProps

export const ResizablePanelGroup: React.FC<ResizablePanelGroupProps> = (props) => {
    return <Group
        data-slot="resizable-panel-group"
        {...(mergeCode0Props(`d-resizable`, props) as ResizablePanelGroupProps)}
    />

}

export const ResizablePanel: React.FC<ResizablePanelProps> = (props) => {
    return <Panel data-slot="resizable-panel" {...mergeCode0Props(`d-resizable__panel ${props.color ? `d-resizable__panel--${props.color ?? "primary"}` : ""}`, props)} />
}

export const ResizableHandle: React.FC<ResizableHandleProps> = (props) => {
    return <Separator
        data-slot="resizable-handle"
        {...mergeCode0Props("d-resizable__handle", props)}>
        <div className={"d-resizable__handle-bar"}/>
    </Separator>

}

