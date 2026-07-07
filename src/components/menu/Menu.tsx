import React from "react";
import "./Menu.style.scss"

import {Color, ComponentProps, mergeComponentProps} from "../../utils";
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

export const Menu: React.FC<MenuProps> = (props) => {
    return <DropdownMenu {...mergeComponentProps(`menu`, props) as MenuProps}/>
}

export const MenuTrigger: React.FC<MenuTriggerProps> = (props) => {
    return <DropdownMenuTrigger {...mergeComponentProps("menu__trigger", props) as MenuTriggerProps}/>
}

export const MenuPortal: React.FC<MenuPortalProps> = (props) => {
    return <DropdownMenuPortal {...mergeComponentProps("menu__portal", props) as MenuPortalProps}/>
}

export const MenuContent: React.FC<MenuContentProps> = (props) => {
    const {children, ...rest} = props
    return <DropdownMenuContent
        align={props.align} {...mergeComponentProps(`menu__content menu__content--${props.color ?? "primary"}`, rest) as MenuContentProps}>
        <AutoScrollArea>
            {children}
        </AutoScrollArea>
    </DropdownMenuContent>
}

export const MenuLabel: React.FC<MenuLabelProps> = (props) => {
    return <DropdownMenuLabel {...mergeComponentProps("menu__label", props) as MenuLabelProps}/>
}

export const MenuItem: React.FC<MenuItemProps> = (props) => {
    return <DropdownMenuItem {...mergeComponentProps("menu__item", props) as MenuItemProps}/>
}

export const MenuGroup: React.FC<MenuGroupProps> = (props) => {
    return <DropdownMenuGroup {...mergeComponentProps("menu__group", props) as MenuGroupProps}/>
}

export const MenuSub: React.FC<MenuSubProps> = (props) => {
    return <DropdownMenuSub {...mergeComponentProps("menu__sub", props) as MenuSubProps}/>
}

export const MenuSubTrigger: React.FC<MenuSubTriggerProps> = (props) => {
    return <DropdownMenuSubTrigger {...mergeComponentProps("menu__sub-trigger", props) as MenuSubTriggerProps}/>
}

export const MenuSubContent: React.FC<MenuSubContentProps> = (props) => {
    const {children, ...rest} = props
    return <DropdownMenuSubContent {...mergeComponentProps(`menu__sub-content menu__sub-content--${props.color ?? "primary"}`, rest) as MenuSubContentProps}>
        <AutoScrollArea>
            {children}
        </AutoScrollArea>
    </DropdownMenuSubContent>
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