import React from "react";
import "./Menu.style.scss"

import {Code0ComponentProps} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";
import {
    DropdownMenu, DropdownMenuArrow,
    DropdownMenuArrowProps, DropdownMenuContent,
    DropdownMenuContentProps, DropdownMenuGroup,
    DropdownMenuGroupProps, DropdownMenuItem,
    DropdownMenuItemProps, DropdownMenuLabel,
    DropdownMenuLabelProps, DropdownMenuPortal,
    DropdownMenuPortalProps,
    DropdownMenuProps, DropdownMenuSeparator,
    DropdownMenuSeparatorProps, DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubContentProps,
    DropdownMenuSubProps, DropdownMenuSubTrigger,
    DropdownMenuSubTriggerProps, DropdownMenuTrigger,
    DropdownMenuTriggerProps
} from "@radix-ui/react-dropdown-menu";

export type MenuProps = Code0ComponentProps & DropdownMenuProps
export type MenuTriggerProps = Code0ComponentProps & DropdownMenuTriggerProps
export type MenuPortalProps = Code0ComponentProps & DropdownMenuPortalProps
export type MenuContentProps = Code0ComponentProps & DropdownMenuContentProps
export type MenuLabelProps = Code0ComponentProps & DropdownMenuLabelProps
export type MenuItemProps = Code0ComponentProps & DropdownMenuItemProps
export type MenuGroupProps = Code0ComponentProps & DropdownMenuGroupProps
export type MenuSubProps = Code0ComponentProps & DropdownMenuSubProps
export type MenuSubTriggerProps = Code0ComponentProps & DropdownMenuSubTriggerProps
export type MenuSubContentProps = Code0ComponentProps & DropdownMenuSubContentProps
export type MenuSeparatorProps = Code0ComponentProps & DropdownMenuSeparatorProps
export type MenuArrowProps = Code0ComponentProps & DropdownMenuArrowProps

export const Menu: React.FC<MenuProps> = (props) => {
    return <DropdownMenu {...mergeCode0Props("menu", props) as MenuProps}/>
}

export const MenuTrigger: React.FC<MenuTriggerProps> = (props) => {
    return <DropdownMenuTrigger {...mergeCode0Props("menu__trigger", props) as MenuTriggerProps}/>
}

export const MenuPortal: React.FC<MenuPortalProps> = (props) => {
    return <DropdownMenuPortal {...mergeCode0Props("menu__portal", props) as MenuPortalProps}/>
}

export const MenuContent: React.FC<MenuContentProps> = (props) => {
    return <DropdownMenuContent align={props.align} {...mergeCode0Props("menu__content", props) as MenuContentProps}/>
}

export const MenuLabel: React.FC<MenuLabelProps> = (props) => {
    return <DropdownMenuLabel {...mergeCode0Props("menu__label", props) as MenuLabelProps}/>
}

export const MenuItem: React.FC<MenuItemProps> = (props) => {
    return <DropdownMenuItem {...mergeCode0Props("menu__item", props) as MenuItemProps}/>
}

export const MenuGroup: React.FC<MenuGroupProps> = (props) => {
    return <DropdownMenuGroup {...mergeCode0Props("menu__group", props) as MenuGroupProps}/>
}

export const MenuSub: React.FC<MenuSubProps> = (props) => {
    return <DropdownMenuSub {...mergeCode0Props("menu__sub", props) as MenuSubProps}/>
}

export const MenuSubTrigger: React.FC<MenuSubTriggerProps> = (props) => {
    return <DropdownMenuSubTrigger {...mergeCode0Props("menu__sub-trigger", props) as MenuSubTriggerProps}/>
}

export const MenuSubContent: React.FC<MenuSubContentProps> = (props) => {
    return <DropdownMenuSubContent {...mergeCode0Props("menu__sub-content", props) as MenuSubContentProps}/>
}

export const MenuSeparator: React.FC<MenuSeparatorProps> = (props) => {
    return <DropdownMenuSeparator {...mergeCode0Props("menu__separator", props) as MenuSeparatorProps}/>
}

export const MenuArrow: React.FC<MenuArrowProps> = (props) => {
    return <DropdownMenuArrow {...mergeCode0Props("menu__arrow", props) as MenuArrowProps}/>
}