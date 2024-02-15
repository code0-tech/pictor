import React from "react";
import {getChild} from "../../utils/utils";
import {PopoverProps} from "../popover/Popover";
import {AriaMenuProps, Key, useButton, useMenuTrigger} from "react-aria";
import {Item, Section, useMenuTriggerState} from "react-stately";
import {AriaButtonOptions} from "@react-aria/button";
import {InternalPopover} from "../popover/InternalPopover";
import {InternalMenu} from "./InternalMenu";
import Badge from "../badge/Badge";
import "./Menu.style.scss"

export interface MenuType<T> extends AriaMenuProps<T>, PopoverProps {
    children: React.ReactElement<MenuTriggerType & MenuContentType>[]
}

export interface MenuTriggerType {
    children: React.ReactElement
}

export interface MenuContentType {
    children: React.ReactNode
}

export interface MenuItemType {
    children: React.ReactNode
    key: Key
    variant?: "primary" | "secondary" | "info" | "success" | "warning" | "error"
    disabled?: boolean
    unselectable?: boolean
    textValue?: string
}

export interface MenuShortcutType {
    children: string
}

export interface MenuIconType {
    children: React.ReactNode
}

export interface MenuSectionType {
    children: React.ReactElement<MenuItemType> | React.ReactElement<MenuItemType>[]
    title?: string
}

const Menu: React.FC<MenuType<any>> = (props) => {

    const {children, placement = "bottom start", ...args} = props

    const menuTrigger = getChild(children, MenuTrigger, true)
    const menuContent = getChild(children, MenuContent, true)

    const state = useMenuTriggerState(props)
    const triggerRef = React.useRef(null)
    const {menuProps, menuTriggerProps} = useMenuTrigger({}, state, triggerRef)
    const {buttonProps} = useButton(menuTriggerProps as AriaButtonOptions<'div'>, triggerRef);

    return (
        <>
            <div ref={triggerRef} {...buttonProps} {...(!state.isOpen && {tabIndex: -1})}>
                {menuTrigger ? React.cloneElement(menuTrigger.props.children, {...buttonProps, ...(!state.isOpen && {tabIndex: 0})}) : null}
            </div>

            {state.isOpen && (
                <InternalPopover {...args} state={state} triggerRef={triggerRef} placement={placement}>
                    {/** @ts-ignore **/}
                    {menuContent ? <InternalMenu {...props} {...menuProps}>
                        {Array.of<React.ReactElement>(menuContent.props.children).flat().map((child: React.ReactElement) => {
                            if (child.type == MenuSection) return <Section {...child.props}>{
                                Array.of<React.ReactElement>(child.props.children).flat().map((item: React.ReactElement) => {
                                    return <Item {...item.props} key={item.key}>{item.props.children}</Item>
                                })
                            }</Section>
                            return <Item {...child.props} key={child.key}>{child.props.children}</Item>
                        })}
                    </InternalMenu> : null}
                </InternalPopover>
            )}
        </>
    )
}

const MenuTrigger: React.FC<MenuTriggerType> = (props) => {

    const {children, ...args} = props

    return <div {...args}>
        {children}
    </div>
}

const MenuContent: React.FC<MenuContentType> = (props) => {

    const {children} = props

    return <div>
        {children}
    </div>
}

const MenuItem: React.FC<MenuItemType> = (props) => {

    const {children} = props

    return <>{children}</>
}

const MenuSection: React.FC<MenuSectionType> = (props) => {

    const {children} = props

    return <>{children}</>
}

const MenuShortcut: React.FC<MenuShortcutType> = (props) => {

    const {children} = props

    return <span className={"menu__shortcut"}><Badge>{children}</Badge></span>

}

const MenuIcon: React.FC<MenuIconType> = (props) => {

    const {children} = props
    return <span className={"menu__icon"}>{children}</span>
}

export default Object.assign(Menu, {
    Trigger: MenuTrigger,
    Content: MenuContent,
    Item: MenuItem,
    Shortcut: MenuShortcut,
    Section: MenuSection,
    Icon: MenuIcon
})