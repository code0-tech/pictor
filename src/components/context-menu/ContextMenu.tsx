"use client"

import React from "react";
import {
    Color,
    ComponentProps,
    mergeComponentProps,
    popperTransformOrigin,
    useObservedOpen,
    usePopperMotion
} from "../../utils";
import * as Radix from "@radix-ui/react-context-menu";
import "./ContextMenu.style.scss"
import {AutoScrollArea} from "../scroll-area/ScrollArea";
import {AnimatePresence, motion} from "motion/react";

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

//the content is force mounted and kept alive by AnimatePresence while it
//animates out, so the open state has to be known one level above it. A context
//menu is only ever opened by the user, so its state can only be observed
const ContextMenuOpenContext = React.createContext(false)
const ContextMenuSubOpenContext = React.createContext(false)

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    const [open, onOpenChange] = useObservedOpen(undefined, undefined, props.onOpenChange)

    return <ContextMenuOpenContext.Provider value={open}>
        <Radix.ContextMenu {...mergeComponentProps(`context-menu`, props) as ContextMenuProps} onOpenChange={onOpenChange}/>
    </ContextMenuOpenContext.Provider>
}

export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = (props) => {
    return <Radix.ContextMenuTrigger {...mergeComponentProps("context-menu__trigger", props) as ContextMenuTriggerProps}/>
}

export const ContextMenuPortal: React.FC<ContextMenuPortalProps> = (props) => {
    //force mounted so the portal outlives the menu's exit animation
    return <Radix.ContextMenuPortal forceMount {...mergeComponentProps("context-menu__portal", props) as ContextMenuPortalProps}/>
}

export const ContextMenuContent: React.FC<ContextMenuContentProps> = (props) => {
    const {children, ...rest} = props
    const open = React.useContext(ContextMenuOpenContext)
    //already open on mount means the user did not open it, so it does not animate in
    const openOnMount = React.useRef(open)
    const motionProps = usePopperMotion()

    return <AnimatePresence initial={!openOnMount.current}>
        {open && <Radix.ContextMenuContent
            key={"context-menu__content"}
            forceMount
            asChild
            {...mergeComponentProps(`context-menu__content context-menu__content--${props.color ?? "primary"}`, rest) as ContextMenuContentProps}>
            <motion.div {...motionProps} style={popperTransformOrigin("context-menu")}>
                <AutoScrollArea>
                    <div className={"context-menu__content-inner"}>
                        {children}
                    </div>
                </AutoScrollArea>
            </motion.div>
        </Radix.ContextMenuContent>}
    </AnimatePresence>
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
    const [open, onOpenChange] = useObservedOpen(props.open, props.defaultOpen, props.onOpenChange)

    return <ContextMenuSubOpenContext.Provider value={open}>
        <Radix.ContextMenuSub {...mergeComponentProps("context-menu__sub", props) as ContextMenuSubProps} onOpenChange={onOpenChange}/>
    </ContextMenuSubOpenContext.Provider>
}

export const ContextMenuSubTrigger: React.FC<ContextMenuSubTriggerProps> = (props) => {
    return <Radix.ContextMenuSubTrigger {...mergeComponentProps("context-menu__sub-trigger", props) as ContextMenuSubTriggerProps}/>
}

export const ContextMenuSubContent: React.FC<ContextMenuSubContentProps> = (props) => {
    const {children, ...rest} = props
    const open = React.useContext(ContextMenuSubOpenContext)
    //already open on mount means the user did not open it, so it does not animate in
    const openOnMount = React.useRef(open)
    const motionProps = usePopperMotion()

    return <AnimatePresence initial={!openOnMount.current}>
        {open && <Radix.ContextMenuSubContent
            key={"context-menu__sub-content"}
            forceMount
            asChild
            {...mergeComponentProps(`context-menu__sub-content context-menu__sub-content--${props.color ?? "primary"}`, rest) as ContextMenuSubContentProps}>
            <motion.div {...motionProps} style={popperTransformOrigin("context-menu")}>
                <AutoScrollArea>
                    <div className={"context-menu__content-inner"}>
                        {children}
                    </div>
                </AutoScrollArea>
            </motion.div>
        </Radix.ContextMenuSubContent>}
    </AnimatePresence>
}

export const ContextMenuSeparator: React.FC<ContextMenuSeparatorProps> = (props) => {
    return <Radix.ContextMenuSeparator {...mergeComponentProps("context-menu__separator", props) as ContextMenuSeparatorProps}/>
}

export const ContextMenuArrow: React.FC<ContextMenuArrowProps> = (props) => {
    return <Radix.ContextMenuArrow {...mergeComponentProps("context-menu__arrow", props) as ContextMenuArrowProps}/>
}