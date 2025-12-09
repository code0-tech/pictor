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
        align={props.align} {...mergeCode0Props(`context-menu__content context-menu__content--${props.color ?? "secondary"}`, props) as ContextMenuContentProps}>
        <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
            {props.children}
        </Card>
        <ContextMenuLabel>
            <Flex style={{gap: ".35rem"}}>
                <Flex align={"center"} style={{gap: "0.35rem"}}>
                    <Flex>
                        <Badge border><IconArrowUp size={12}/></Badge>
                        <Badge border><IconArrowDown size={12}/></Badge>
                    </Flex>
                    move
                </Flex>
                <Spacing spacing={"xxs"}/>
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Badge border><IconCornerDownLeft size={12}/></Badge>
                    select
                </Flex>
            </Flex>
        </ContextMenuLabel>
    </Radix.ContextMenuContent>
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
    return <Radix.ContextMenuSubContent {...mergeCode0Props(`context-menu__sub-content context-menu__sub-content--${props.color ?? "secondary"}`, props) as ContextMenuSubContentProps}>
        <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
            {props.children}
        </Card>
        <ContextMenuLabel>
            <Flex style={{gap: ".35rem"}}>
                <Flex align={"center"} style={{gap: "0.35rem"}}>
                    <Flex>
                        <Badge border><IconArrowUp size={12}/></Badge>
                        <Badge border><IconArrowDown size={12}/></Badge>
                    </Flex>
                    move
                </Flex>
                <Spacing spacing={"xxs"}/>
                <Flex align={"center"} style={{gap: ".35rem"}}>
                    <Badge border><IconCornerDownLeft size={12}/></Badge>
                    select
                </Flex>
            </Flex>
        </ContextMenuLabel>
    </Radix.ContextMenuSubContent>
}

export const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = (props) => {
    return <Radix.ContextMenuSeparator {...mergeCode0Props("context-menu__separator", props) as ContextMenuSeparatorProps}/>
}

export const ContextMenuArrow: React.FC<ContextMenuArrowProps> = (props) => {
    return <Radix.ContextMenuArrow {...mergeCode0Props("context-menu__arrow", props) as ContextMenuArrowProps}/>
}