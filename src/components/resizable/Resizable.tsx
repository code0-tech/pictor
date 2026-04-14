"use client"

import * as React from "react"
import {ComponentProps, Color} from "../../utils";
import {mergeComponentProps} from "../../utils";
import {Group, GroupProps, Panel, PanelProps, Separator, SeparatorProps} from "react-resizable-panels";
import "./Resizable.style.scss"

type ResizablePanelGroupProps = ComponentProps & GroupProps
type ResizablePanelProps = ComponentProps & PanelProps & {color?: Color}
type ResizableHandleProps = ComponentProps & SeparatorProps

export const ResizablePanelGroup: React.FC<ResizablePanelGroupProps> = (props) => {
    return <Group
        data-slot="resizable-panel-group"
        {...(mergeComponentProps(`d-resizable`, props) as ResizablePanelGroupProps)}
    />

}

export const ResizablePanel: React.FC<ResizablePanelProps> = (props) => {
    return <Panel data-slot="resizable-panel" {...mergeComponentProps(`d-resizable__panel ${props.color ? `d-resizable__panel--${props.color ?? "primary"}` : ""}`, props)} />
}

export const ResizableHandle: React.FC<ResizableHandleProps> = (props) => {
    return <Separator
        data-slot="resizable-handle"
        {...mergeComponentProps("d-resizable__handle", props)}>
        <div className={"d-resizable__handle-bar"}/>
    </Separator>

}

