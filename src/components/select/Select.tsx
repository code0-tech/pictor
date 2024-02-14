import {getChild} from "../../utils/utils";
import {Item, Section, Selection, useMenuTriggerState} from "react-stately";
import React, {useEffect, useState} from "react";
import {AriaMenuProps, Key, useButton, useMenuTrigger} from "react-aria";
import {AriaButtonOptions} from "@react-aria/button";
import {InternalPopover} from "../popover/InternalPopover";
import {InternalMenu} from "../menu/InternalMenu";
import {PopoverProps} from "../popover/Popover";
import Menu, {MenuIconType, MenuItemType} from "../menu/Menu";
import Badge from "../badge/Badge";
import Input from "../input/Input";
import {Icon, IconMail, IconSelect, IconSelector, TablerIconsProps} from "@tabler/icons-react";

export interface SelectType {
    children: React.ReactElement<SelectIconType & SelectOptionType>[] | React.ReactElement<SelectIconType & SelectOptionType>,
    defaultValue?: string,
    disabled?: boolean,
    description?: string,
    forbidDeselect?: boolean,
}

export interface SelectIconType {
    children: TablerIconsProps
}

export interface SelectOptionType extends Omit<MenuItemType, "key"> {
    children: string
}

export interface SelectLabelType {
    children: string,
}


const Select: React.FC<SelectType> = (props) => {

    const [selection, setSelection] = useState<Selection>(new Set([props.defaultValue ?? ""]));
    const selectedArray = [...selection] as string[]
    const selectLabel: any = getChild(props.children, SelectLabel, false)

    const InputComponent: React.FC<any> = (otherProps) => {
        return <Input {...otherProps}>
            {selectLabel && <Input.Label>{selectLabel}</Input.Label>}
            <Input.Control placeholder={selectedArray[0]} value={selectedArray[0]} readOnly={true}>
                <Input.Control.Icon>{getChild(props.children, SelectIcon, false) ??
                    <IconSelector/>}</Input.Control.Icon>
            </Input.Control>
            {props.description ? <Input.Desc>{props.description}</Input.Desc> : <></>}
        </Input>
    }

    return props.disabled ? <InputComponent disabled/> :
        <Menu defaultSelectedKeys={[props.defaultValue ?? ""]} selectionMode={"single"} selectedKeys={selection}
              onSelectionChange={selection => {
                  const keys: Set<Key> = selection as Set<Key>;
                  if (keys.size === 0 && props.forbidDeselect) return
                  setSelection(keys.size === 0 ? new Set([""]) : selection)
              }}>
            <Menu.Trigger>
                <InputComponent/>
            </Menu.Trigger>

            <Menu.Content>
                {
                    Array.of(props.children).flat().filter(child => child?.type === SelectionOption).map(child => {
                        return <Menu.Item  {...child.props} key={child.props.children}/>
                    })
                }
            </Menu.Content>
        </Menu>


}


const SelectionOption: React.FC<SelectOptionType> = (props) => {

    const {children} = props

    return <>{children}</>
}

const SelectLabel: React.FC<SelectLabelType> = (props) => {

    const {children} = props

    return <>{children}</>
}

const SelectIcon: React.FC<TablerIconsProps> = (props) => {

    const {children} = props

    return <>{children}</>
}


export default Object.assign(Select, {
    Option: SelectionOption,
    Icon: SelectIcon,
    Label: SelectLabel
})
