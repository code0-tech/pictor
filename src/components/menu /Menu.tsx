import React from "react";
import "./Menu.style.scss"

import {
    //props
    MenuProviderProps as AKMenuProviderProps,
    MenuButtonProps as AKMenuButtonProps,
    MenuButtonArrowProps as AKMenuButtonArrowProps,
    MenuProps as AKMenuProps,
    MenuItemProps as AKMenuItemProps,
    MenuSeparatorProps as AKMenuSeparatorProps,
    //components
    MenuProvider as AKMenuProvider,
    MenuButton as AKMenuButton,
    MenuButtonArrow as AKMenuButtonArrow,
    Menu as AKMenu,
    MenuItem as AKMenuItem,
    MenuSeparator as AKMenuSeparator,
} from "@ariakit/react"
import {Code0ComponentProps} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

type MenuProps = AKMenuProviderProps
type MenuTriggerProps = Code0ComponentProps & AKMenuButtonProps & { children: React.ReactElement }
type MenuTriggerArrowProps = Code0ComponentProps & AKMenuButtonArrowProps
type MenuBodyProps = Code0ComponentProps & AKMenuProps
type MenuItemProps = Code0ComponentProps & AKMenuItemProps
type MenuSeparatorProps = Code0ComponentProps & AKMenuSeparatorProps

const Menu: React.FC<MenuProps> = (props) => <AKMenuProvider {...props} />
export const MenuTrigger: React.FC<MenuTriggerProps> = (firstProps) => <AKMenuButton
    render={(props) => {
        return React.cloneElement(firstProps.children, props);
    }}/>
export const MenuTriggerArrow: React.FC<MenuTriggerArrowProps> = (props) => <AKMenuButtonArrow {...props} />
export const MenuBody: React.FC<MenuBodyProps> = (props) => <AKMenu {...mergeCode0Props("menu", props)}/>
export const MenuItem: React.FC<MenuItemProps> = (props) => <AKMenuItem {...mergeCode0Props("menu__item", props)}/>
export const MenuSeparator: React.FC<MenuSeparatorProps> = (props) => <AKMenuSeparator {...mergeCode0Props("menu__separator", props)}/>

export default Menu