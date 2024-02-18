import {Selection} from "react-stately"
import React, {useEffect, useState} from "react"
import {Key} from "react-aria"
import Menu, {MenuItemType, MenuType} from "../menu/Menu"
import Input from "../input/Input"
import {IconSelector, IconX, TablerIconsProps} from "@tabler/icons-react"
import Pill from "../pill/Pill";
import "./MultiSelect.style.scss"

export interface SelectType extends Omit<MenuType<any>, "children"> {
    children: React.ReactElement<SelectIconType & MenuItemType>[] | React.ReactElement<SelectIconType & MenuItemType>,
    defaultValue?: string[], //Default value for the selection, if the value doesn't exist the value is still displayed in the select (don't use values which doesn't exist)
    disabled?: boolean, //If true the select is disabled and cant be used
    clearable?: boolean, //Adds an icon to clear the current selection
    label?: string, //A text which is displayed above the input to give a short description
    placeholder?: string,
    error?: React.ReactNode, //A Node which is displayed as an error
    success?: React.ReactNode, //A Node which is displayed as a success
    description?: string, //A description for the input
    disallowDeselection?: boolean, //If true the user cant deselect an element
}

export interface SelectIconType {
    children: TablerIconsProps
}

//TODO implement label-, description-, error- and SuccessMessages
//These components dont exists, waiting for Nico


const MultiSelect: React.FC<SelectType> = (props) => {
    const {
        disabled = false, clearable = false, defaultValue = [],
        onSelectionChange = () => {
        },
        children, label, disallowDeselection = false,
        success, description,
        error, placeholder, placement = "bottom start"
    } = props

    const [selection, setSelection] = useState<Selection>(new Set(defaultValue ? defaultValue : []))
    const selectedArray = [...selection] as string[]

    console.log(selectedArray.length)

    return <>
        {disabled ? <Input disabled>
                <Input.Control {...(label ? {label: label} : {label: ""})}
                               placeholder={placeholder && selectedArray.length !== 0 ? placeholder : ""}
                               readOnly>
                    <Input.Control.Icon>
                        {clearable && selectedArray[0] !== "" ? <IconX className={"xIcon"}/> : <IconSelector/>}
                    </Input.Control.Icon>
                </Input.Control>
            </Input> :
            <Menu placement={placement} defaultSelectedKeys={defaultValue ?? ""} selectionMode={"multiple"}
                  selectedKeys={selection}
                  onSelectionChange={selection => {
                      const keys: Set<Key> = selection as Set<Key>
                      if (keys.size === 0 && disallowDeselection) return
                      let newSelection = keys.size === 0 ? new Set([""]) : selection
                      setSelection(newSelection)
                      onSelectionChange(selection)
                  }}>
                <Menu.Trigger>
                    <div onClick={event => {
                        if ((event.target as HTMLDivElement).className === "multi-select-wrapper") {
                            if (clearable) setSelection(new Set())
                        }

                    }} className={"multi-select"}>
                        {clearable && selectedArray.length !== 0 ? <IconX className={"multi-select__icon"}/> :
                            <IconSelector className={"multi-select__icon"}/>}
                        <div id={"multi-select__pill-wrapper"} className={"multi-select__pill-wrapper"}>
                            {selectedArray.filter(entry => entry !== "").map((value, index) => {
                                return <Pill size={"sm"} color={"secondary"} key={index} removeButton={true}
                                             onClose={(event: MouseEvent) => {
                                                 const newArray = selectedArray.filter(entry => entry !== value);
                                                 const newSelection = new Set(newArray.length === 0 ? [] : newArray);

                                                 setSelection(newSelection)

                                             }}>
                                    {value}
                                </Pill>
                            })}
                        </div>
                        {selectedArray.length === 0 ?
                            <input value={(selectedArray.length === 0 && placeholder) ? placeholder : ""}
                                   className={"multi-select__input"}
                                   readOnly></input>: null}
                    </div>
                </Menu.Trigger>

                <Menu.Content>
                    {
                        Array.of(children).flat().filter(child => child?.type === SelectionOption).map((child, index) => {
                            return <Menu.Item {...child.props}
                                              key={child.key ?? index}>{child.props.children}</Menu.Item>
                        })
                    }
                </Menu.Content>
            </Menu>
        }
    </>


}

const SelectionOption: React.FC<MenuItemType> = (props) => {

    const {children} = props

    return <>{children}</>
}

export default Object.assign(MultiSelect, {
    Option: SelectionOption,
})
