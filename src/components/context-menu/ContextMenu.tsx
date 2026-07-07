"use client"

import React from "react";
import {ComponentProps, Color, mergeComponentProps} from "../../utils";
import * as Radix from "@radix-ui/react-context-menu";
import "./ContextMenu.style.scss"
import {AutoScrollArea} from "../scroll-area/ScrollArea";

export type ContextMenuProps = ComponentProps & Radix.ContextMenuProps
export type ContextMenuTriggerProps = ComponentProps & Radix.ContextMenuTriggerProps
export type ContextMenuPortalProps = ComponentProps & Radix.ContextMenuPortalProps
export type ContextMenuContentProps = ComponentProps & Radix.ContextMenuContentProps & {
    color?: Color
}
export type ContextMenuLabelProps = ComponentProps & Radix.ContextMenuLabelProps
export type ContextMenuItemProps = ComponentProps & Radix.ContextMenuItemProps
export type ContextMenuGroupProps = ComponentProps & Radix.ContextMenuGroupProps
export type ContextMenuSubProps = ComponentProps & Radix.ContextMenuSubProps
export type ContextMenuSubTriggerProps = ComponentProps & Radix.ContextMenuSubTriggerProps
export type ContextMenuSubContentProps = ComponentProps & Radix.ContextMenuSubContentProps & {
    color?: Color
}
export type ContextMenuSeparatorProps = ComponentProps & Radix.ContextMenuSeparatorProps
export type ContextMenuArrowProps = ComponentProps & Radix.ContextMenuArrowProps

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    return <Radix.ContextMenu {...mergeComponentProps(`context-menu`, props) as ContextMenuProps}/>
}

export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = (props) => {
    return <Radix.ContextMenuTrigger {...mergeComponentProps("context-menu__trigger", props) as ContextMenuTriggerProps}/>
}

export const ContextMenuPortal: React.FC<ContextMenuPortalProps> = (props) => {
    return <Radix.ContextMenuPortal {...mergeComponentProps("context-menu__portal", props) as ContextMenuPortalProps}/>
}

export const ContextMenuContent: React.FC<ContextMenuContentProps> = (props) => {
    const {children, ...rest} = props
    return <Radix.ContextMenuContent
        align={props.align} {...mergeComponentProps(`context-menu__content context-menu__content--${props.color ?? "primary"}`, rest) as ContextMenuContentProps}>
        <AutoScrollArea>
            {children}
        </AutoScrollArea>
    </Radix.ContextMenuContent>
}

export const ContextMenuLabel: React.FC<ContextMenuLabelProps> = (props) => {
    return <Radix.ContextMenuLabel {...mergeComponentProps("context-menu__label", props) as ContextMenuLabelProps}/>
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = (props) => {
    return <Radix.ContextMenuItem {...mergeComponentProps("context-menu__item", props) as ContextMenuItemProps}/>
}

export const ContextMenuGroup: React.FC<ContextMenuGroupProps> = (props) => {
    return <Radix.ContextMenuGroup {...mergeComponentProps("context-menu__group", props) as ContextMenuGroupProps}/>
}

export const ContextMenuSub: React.FC<ContextMenuSubProps> = (props) => {
    return <Radix.ContextMenuSub {...mergeComponentProps("context-menu__sub", props) as ContextMenuSubProps}/>
}

export const ContextMenuSubTrigger: React.FC<ContextMenuSubTriggerProps> = (props) => {
    return <Radix.ContextMenuSubTrigger {...mergeComponentProps("context-menu__sub-trigger", props) as ContextMenuSubTriggerProps}/>
}

export const ContextMenuSubContent: React.FC<ContextMenuSubContentProps> = (props) => {
    const {children, ...rest} = props
    return <Radix.ContextMenuSubContent align={props.align} {...mergeComponentProps(`context-menu__sub-content context-menu__sub-content--${props.color ?? "primary"}`, rest) as ContextMenuSubContentProps}>
        <AutoScrollArea>
            {children}
        </AutoScrollArea>
    </Radix.ContextMenuSubContent>
}

export const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = (props) => {
    return <Radix.ContextMenuSeparator {...mergeComponentProps("context-menu__separator", props) as ContextMenuSeparatorProps}/>
}

export const ContextMenuArrow: React.FC<ContextMenuArrowProps> = (props) => {
    return <Radix.ContextMenuArrow {...mergeComponentProps("context-menu__arrow", props) as ContextMenuArrowProps}/>
}