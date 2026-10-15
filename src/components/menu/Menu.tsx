import React from "react";
import "./Menu.style.scss"

import {
    Color,
    ComponentProps,
    mergeComponentProps,
    popperTransformOrigin,
    useObservedOpen,
    usePopperMotion
} from "../../utils";
import {AnimatePresence, motion} from "motion/react";
import {
    DropdownMenu,
    DropdownMenuArrow,
    DropdownMenuArrowProps,
    DropdownMenuCheckboxItem,
    DropdownMenuCheckboxItemProps,
    DropdownMenuContent,
    DropdownMenuContentProps,
    DropdownMenuGroup,
    DropdownMenuGroupProps,
    DropdownMenuItem,
    DropdownMenuItemIndicator,
    DropdownMenuItemIndicatorProps,
    DropdownMenuItemProps,
    DropdownMenuLabel,
    DropdownMenuLabelProps,
    DropdownMenuPortal,
    DropdownMenuPortalProps,
    DropdownMenuProps,
    DropdownMenuSeparator,
    DropdownMenuSeparatorProps,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubContentProps,
    DropdownMenuSubProps,
    DropdownMenuSubTrigger,
    DropdownMenuSubTriggerProps,
    DropdownMenuTrigger,
    DropdownMenuTriggerProps
} from "@radix-ui/react-dropdown-menu";
import {AutoScrollArea} from "../scroll-area/ScrollArea";

export type MenuProps = ComponentProps & DropdownMenuProps
export type MenuTriggerProps = ComponentProps & DropdownMenuTriggerProps
export type MenuPortalProps = ComponentProps & DropdownMenuPortalProps
export type MenuContentProps = ComponentProps & DropdownMenuContentProps & {
    color?: Color
}
export type MenuLabelProps = ComponentProps & DropdownMenuLabelProps
export type MenuItemProps = ComponentProps & DropdownMenuItemProps
export type MenuCheckboxItemProps = ComponentProps & DropdownMenuCheckboxItemProps
export type MenuItemIndicatorProps = ComponentProps & DropdownMenuItemIndicatorProps
export type MenuGroupProps = ComponentProps & DropdownMenuGroupProps
export type MenuSubProps = ComponentProps & DropdownMenuSubProps
export type MenuSubTriggerProps = ComponentProps & DropdownMenuSubTriggerProps
export type MenuSubContentProps = ComponentProps & DropdownMenuSubContentProps & {
    color?: Color
}
export type MenuSeparatorProps = ComponentProps & DropdownMenuSeparatorProps
export type MenuArrowProps = ComponentProps & DropdownMenuArrowProps

//the content is force mounted and kept alive by AnimatePresence while it
//animates out, so the open state has to be known one level above it
const MenuOpenContext = React.createContext(false)
const MenuSubOpenContext = React.createContext(false)

export const Menu: React.FC<MenuProps> = (props) => {
    const [open, onOpenChange] = useObservedOpen(props.open, props.defaultOpen, props.onOpenChange)

    return <MenuOpenContext.Provider value={open}>
        <DropdownMenu {...mergeComponentProps(`menu`, props) as MenuProps} onOpenChange={onOpenChange}/>
    </MenuOpenContext.Provider>
}

export const MenuTrigger: React.FC<MenuTriggerProps> = (props) => {
    return <DropdownMenuTrigger {...mergeComponentProps("menu__trigger", props) as MenuTriggerProps}/>
}

export const MenuPortal: React.FC<MenuPortalProps> = (props) => {
    //force mounted so the portal outlives the menu's exit animation
    return <DropdownMenuPortal forceMount {...mergeComponentProps("menu__portal", props) as MenuPortalProps}/>
}

export const MenuContent: React.FC<MenuContentProps> = (props) => {
    const {children, ...rest} = props
    const open = React.useContext(MenuOpenContext)
    //already open on mount means the user did not open it, so it does not animate in
    const openOnMount = React.useRef(open)
    const motionProps = usePopperMotion()

    return <AnimatePresence initial={!openOnMount.current}>
        {open && <DropdownMenuContent
            key={"menu__content"}
            forceMount
            asChild
            align={props.align} {...mergeComponentProps(`menu__content menu__content--${props.color ?? "primary"}`, rest) as MenuContentProps}>
            <motion.div {...motionProps} style={popperTransformOrigin("dropdown-menu")}>
                <AutoScrollArea>
                    <div className={"menu__content-inner"}>
                        {children}
                    </div>
                </AutoScrollArea>
            </motion.div>
        </DropdownMenuContent>}
    </AnimatePresence>
}

export const MenuLabel: React.FC<MenuLabelProps> = (props) => {
    return <DropdownMenuLabel {...mergeComponentProps("menu__label", props) as MenuLabelProps}/>
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>((props, ref) => {
    return <DropdownMenuItem ref={ref} {...mergeComponentProps("menu__item", props) as MenuItemProps}/>
})

export const MenuGroup: React.FC<MenuGroupProps> = (props) => {
    return <DropdownMenuGroup {...mergeComponentProps("menu__group", props) as MenuGroupProps}/>
}

export const MenuSub: React.FC<MenuSubProps> = (props) => {
    const [open, onOpenChange] = useObservedOpen(props.open, props.defaultOpen, props.onOpenChange)

    return <MenuSubOpenContext.Provider value={open}>
        <DropdownMenuSub {...mergeComponentProps("menu__sub", props) as MenuSubProps} onOpenChange={onOpenChange}/>
    </MenuSubOpenContext.Provider>
}

export const MenuSubTrigger = React.forwardRef<HTMLDivElement, MenuSubTriggerProps>((props, ref) => {
    return <DropdownMenuSubTrigger ref={ref} {...mergeComponentProps("menu__sub-trigger", props) as MenuSubTriggerProps}/>
})

export const MenuSubContent: React.FC<MenuSubContentProps> = (props) => {
    const {children, ...rest} = props
    const open = React.useContext(MenuSubOpenContext)
    //already open on mount means the user did not open it, so it does not animate in
    const openOnMount = React.useRef(open)
    const motionProps = usePopperMotion()

    return <AnimatePresence initial={!openOnMount.current}>
        {open && <DropdownMenuSubContent
            key={"menu__sub-content"}
            forceMount
            asChild
            {...mergeComponentProps(`menu__sub-content menu__sub-content--${props.color ?? "primary"}`, rest) as MenuSubContentProps}>
            <motion.div {...motionProps} style={popperTransformOrigin("dropdown-menu")}>
                <AutoScrollArea>
                    <div className={"menu__content-inner"}>
                        {children}
                    </div>
                </AutoScrollArea>
            </motion.div>
        </DropdownMenuSubContent>}
    </AnimatePresence>
}

export const MenuSeparator: React.FC<MenuSeparatorProps> = (props) => {
    return <DropdownMenuSeparator {...mergeComponentProps("menu__separator", props) as MenuSeparatorProps}/>
}

export const MenuCheckboxItem: React.FC<MenuCheckboxItemProps> = (props) => {
    return <DropdownMenuCheckboxItem {...mergeComponentProps("menu__checkbox-item", props) as MenuCheckboxItemProps}/>
}

export const MenuItemIndicator: React.FC<MenuItemIndicatorProps> = (props) => {
    return <DropdownMenuItemIndicator {...mergeComponentProps("menu__item-indicator", props) as MenuItemIndicatorProps}/>
}

export const MenuArrow: React.FC<MenuArrowProps> = (props) => {
    return <DropdownMenuArrow {...mergeComponentProps("menu__arrow", props) as MenuArrowProps}/>
}