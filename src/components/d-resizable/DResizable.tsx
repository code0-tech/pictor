"use client"

import * as React from "react"
import {Code0ComponentProps} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";
import {
    Panel,
    PanelGroup,
    PanelGroupProps,
    PanelProps,
    PanelResizeHandle,
    PanelResizeHandleProps
} from "react-resizable-panels";
import "./DResizable.style.scss"
import {IconFolder, IconGripVertical} from "@tabler/icons-react";

type DResizablePanelGroupProps = Code0ComponentProps & PanelGroupProps
type DResizablePanelProps = Code0ComponentProps & PanelProps
type DResizableHandleProps = Code0ComponentProps & PanelResizeHandleProps

export const DResizablePanelGroup: React.FC<DResizablePanelGroupProps> = (props) => {
    return <PanelGroup
        data-slot="resizable-panel-group"
        {...(mergeCode0Props("d-resizable", props) as DResizablePanelGroupProps)}
    />

}

export const DResizablePanel: React.FC<DResizablePanelProps> = (props) => {
    return <Panel data-slot="resizable-panel" {...mergeCode0Props("d-resizable__panel", props)} />
}

export const DResizableHandle: React.FC<DResizableHandleProps> = (props) => {
    return <PanelResizeHandle
        data-slot="resizable-handle"
        {...mergeCode0Props("d-resizable__handle", props)}>
        <div className={"d-resizable__handle-bar"}/>
    </PanelResizeHandle>

}

