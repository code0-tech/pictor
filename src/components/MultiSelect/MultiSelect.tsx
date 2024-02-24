import {Selection} from "react-stately"
import React, {useEffect, useState} from "react"
import {Key} from "react-aria"
import Menu, {MenuItemType, MenuType} from "../menu/Menu"
import Input from "../input/Input"
import {IconSelector, IconX, TablerIconsProps} from "@tabler/icons-react"
import Pill from "../pill/Pill";
import "./MultiSelect.style.scss"

export interface SelectType extends Omit<MenuType<any>, "children"> {
    children: React.ReactElement<MenuItemType>[] | React.ReactElement<MenuItemType>,
    defaultValue?: string[], //Default value for the selection, if the value doesn't exist the value is still displayed in the select (don't use values which doesn't exist)
    disabled?: boolean, //If true the select is disabled and cant be used
    label?: string, //A text which is displayed above the input to give a short description
    maxValues?: number, //defaults to undefined
    placeholder?: string,
    error?: React.ReactNode, //A Node which is displayed as an error
    success?: React.ReactNode, //A Node which is displayed as a success
    description?: string, //A description for the input
}

//TODO implement label-, description-, error- and SuccessMessages
//These components dont exists, waiting for Nico


const MultiSelect: React.FC<SelectType> = (props) => {
    const {
        disabled = false, defaultValue = [],
        onSelectionChange = () => {
        },
        children, label, maxValues,
        success, description,
        error, placeholder, placement = "bottom start"
    } = props



    const [open, setOpen] = useState<boolean>(false)
    const [selection, setSelection] = useState<Selection>(new Set(defaultValue ? defaultValue : []))
    const selectedArray = [...selection] as string[]


    return <>
        {disabled ? <Input disabled>
                <Input.Control {...(label ? {label: label} : {label: ""})}
                               placeholder={placeholder && selectedArray.length !== 0 ? placeholder : ""}
                               readOnly>
                    <Input.Control.Icon>
                        {<IconSelector/>}
                    </Input.Control.Icon>
                </Input.Control>
            </Input> :
            <Menu placement={placement} defaultSelectedKeys={defaultValue ?? ""} selectionMode={"multiple"}
                  selectedKeys={selection}
                  isOpen={open}
                  onOpenChange={isOpen => {
                      //prevent change over mouse location and check
                      const hoveredElements = document.querySelectorAll(':hover');
                      const hoveredElement = hoveredElements[hoveredElements.length - 1]

                      !hoveredElement.classList.contains("button") && setOpen(isOpen)
                  }}
                  onSelectionChange={selection => {
                      const keys: Set<Key> = selection as Set<Key>
                      if (maxValues && (keys.size > maxValues && selectedArray.length < keys.size)) return
                      let newSelection = keys.size === 0 ? new Set([]) : selection
                      setSelection(newSelection)
                      onSelectionChange(selection)
                  }}>
                <Menu.Trigger>
                    <div className={"multi-select"}>
                        <div className={"multi-select__pill-wrapper"}>
                            {selectedArray.filter(entry => entry !== "").map((value, index) => {
                                return <Pill size={"sm"} color={"primary"} key={index} removeButton={true}
                                             onClose={() => {
                                                 const newArray = selectedArray.filter(entry => entry !== value);
                                                 const newSelection = new Set(newArray.length === 0 ? [] : newArray);
                                                 if (maxValues && maxValues > 1 && (newSelection.size > maxValues && selectedArray.length < newSelection.size)) return
                                                 setSelection(newSelection)
                                             }}>
                                    {value}
                                </Pill>
                            })}
                        </div>
                        {selectedArray.length === 0 ?
                            <input value={(selectedArray.length === 0 && placeholder) ? placeholder : ""}
                                   className={"multi-select__input"}
                                   readOnly></input> : null}
                        <div>
                            <IconSelector className={"multi-select__icon"}/>
                        </div>
                    </div>
                </Menu.Trigger>

                <Menu.Content>
                    {
                        Array.of(children).flat().filter(child => child?.type === SelectionOption).map((child, index) => {
                            return <Menu.Item {...child.props}
                                              key={child.key ?? index}
                                              textValue={String(child.key)}>{child.props.children}</Menu.Item>
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
