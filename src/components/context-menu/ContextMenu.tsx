"use client"

import React from "react";
import {Code0ComponentProps, Color, mergeCode0Props} from "../../utils";
import * as Radix from "@radix-ui/react-context-menu";
import "./ContextMenu.style.scss"
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Badge} from "../badge/Badge";
import {IconArrowDown, IconArrowUp, IconCornerDownLeft} from "@tabler/icons-react";
import {Spacing} from "../spacing/Spacing";

export type ContextMenuProps = Code0ComponentProps & Radix.ContextMenuProps
export type ContextMenuTriggerProps = Code0ComponentProps & Radix.ContextMenuTriggerProps
export type ContextMenuPortalProps = Code0ComponentProps & Radix.ContextMenuPortalProps
export type ContextMenuContentProps = Code0ComponentProps & Radix.ContextMenuContentProps & {
    color?: Color
}
export type ContextMenuLabelProps = Code0ComponentProps & Radix.ContextMenuLabelProps
export type ContextMenuItemProps = Code0ComponentProps & Radix.ContextMenuItemProps
export type ContextMenuGroupProps = Code0ComponentProps & Radix.ContextMenuGroupProps
export type ContextMenuSubProps = Code0ComponentProps & Radix.ContextMenuSubProps
export type ContextMenuSubTriggerProps = Code0ComponentProps & Radix.ContextMenuSubTriggerProps
export type ContextMenuSubContentProps = Code0ComponentProps & Radix.ContextMenuSubContentProps & {
    color?: Color
}
export type ContextMenuSeparatorProps = Code0ComponentProps & Radix.ContextMenuSeparatorProps
export type ContextMenuArrowProps = Code0ComponentProps & Radix.ContextMenuArrowProps

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    return <Radix.ContextMenu {...mergeCode0Props(`context-menu`, props) as ContextMenuProps}/>
}

export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = (props) => {
    return <Radix.ContextMenuTrigger {...mergeCode0Props("context-menu__trigger", props) as ContextMenuTriggerProps}/>
}

export const ContextMenuPortal: React.FC<ContextMenuPortalProps> = (props) => {
    return <Radix.ContextMenuPortal {...mergeCode0Props("context-menu__portal", props) as ContextMenuPortalProps}/>
}

export const ContextMenuContent: React.FC<ContextMenuContentProps> = (props) => {
    return <Radix.ContextMenuContent
        align={props.align} {...mergeCode0Props(`context-menu__content context-menu__content--${props.color ?? "primary"}`, props) as ContextMenuContentProps}/>
}

export const ContextMenuLabel: React.FC<ContextMenuLabelProps> = (props) => {
    return <Radix.ContextMenuLabel {...mergeCode0Props("context-menu__label", props) as ContextMenuLabelProps}/>
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = (props) => {
    return <Radix.ContextMenuItem {...mergeCode0Props("context-menu__item", props) as ContextMenuItemProps}/>
}

export const ContextMenuGroup: React.FC<ContextMenuGroupProps> = (props) => {
    return <Radix.ContextMenuGroup {...mergeCode0Props("context-menu__group", props) as ContextMenuGroupProps}/>
}

export const ContextMenuSub: React.FC<ContextMenuSubProps> = (props) => {
    return <Radix.ContextMenuSub {...mergeCode0Props("context-menu__sub", props) as ContextMenuSubProps}/>
}

export const ContextMenuSubTrigger: React.FC<ContextMenuSubTriggerProps> = (props) => {
    return <Radix.ContextMenuSubTrigger {...mergeCode0Props("context-menu__sub-trigger", props) as ContextMenuSubTriggerProps}/>
}

export const ContextMenuSubContent: React.FC<ContextMenuSubContentProps> = (props) => {
    return <Radix.ContextMenuSubContent align={props.align} {...mergeCode0Props(`context-menu__sub-content context-menu__sub-content--${props.color ?? "primary"}`, props) as ContextMenuSubContentProps}/>
}

export const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = (props) => {
    return <Radix.ContextMenuSeparator {...mergeCode0Props("context-menu__separator", props) as ContextMenuSeparatorProps}/>
}

export const ContextMenuArrow: React.FC<ContextMenuArrowProps> = (props) => {
    return <Radix.ContextMenuArrow {...mergeCode0Props("context-menu__arrow", props) as ContextMenuArrowProps}/>
}