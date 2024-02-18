import {Selection} from "react-stately"
import React, {useEffect, useState} from "react"
import {Key, Placement} from "react-aria"
import Menu, {MenuItemType, MenuType} from "../menu/Menu"
import Input from "../input/Input"
import {IconSelector, IconX, TablerIconsProps} from "@tabler/icons-react"
import Pill from "../pill/Pill";
import "./MultiSelect.style.scss"

export interface SelectType extends Omit<MenuType<any>, "children">{
    children: React.ReactElement<SelectIconType & MenuItemType>[] | React.ReactElement<SelectIconType & MenuItemType>,
    defaultValue?: string, //Default value for the selection, if the value doesn't exist the value is still displayed in the select (don't use values which doesn't exist)
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
        disabled = false, clearable = false, defaultValue,
        onSelectionChange = () => {
        },
        children, label, disallowDeselection = false,
        success, description,
        error, placeholder, placement = "bottom"
    } = props

    const [selection, setSelection] = useState<Selection>(new Set(defaultValue ? [defaultValue] : []))
    const selectedArray = [...selection] as string[]

    useEffect(() => {
        const wrapperWidth = document.getElementsByClassName("multi-select-input")[0].clientWidth - 1
        const elementById = document.getElementById("multi-select-pill-wrapper");
        if (!elementById) return
        elementById.style.width = wrapperWidth + "px"
    }, [document.getElementsByClassName("multi-select-input")[0]?.clientWidth])

    return <div onClick={event => {
        console.log((event.target as HTMLDivElement).className)
        if ((event.target as HTMLDivElement).className === "multi-select-wrapper") {
            if (clearable) setSelection(new Set())
        }

    }} className={"multi-select-wrapper"}>
        <div className={"multi-select-icon"}>
            {clearable && selectedArray.length !== 0 ? <IconX className={"xIcon"}/> : <IconSelector/>}
        </div>
        <div>
            <div id={"multi-select-pill-wrapper"} className={"multi-select-pill-wrapper"}>
                {selectedArray.filter(entry => entry !== "").map((value, index) => {
                    return <Pill key={index} removeButton onRemoveButtonClick={() => {
                        const newArray = selectedArray.filter(entry => entry !== value);
                        const newSelection = new Set(newArray.length === 0 ? [""] : newArray);

                        setSelection(newSelection)
                    }}>
                        {value}
                    </Pill>
                })}
            </div>
            {disabled ? <Input disabled>
                    <Input.Control {...(label ? {label: label} : {label: ""})} placeholder={placeholder ?? ""}
                                   readOnly>
                        <Input.Control.Icon>
                            {clearable && selectedArray[0] !== "" ? <IconX className={"xIcon"}/> : <IconSelector/>}
                        </Input.Control.Icon>
                    </Input.Control>
                </Input> :
                <Menu placement={placement} defaultSelectedKeys={[defaultValue ?? ""]} selectionMode={"multiple"} selectedKeys={selection}
                      onSelectionChange={selection => {
                          onSelectionChange(selection)
                      }}>
                    <Menu.Trigger>
                        <input defaultValue={placeholder ?? ""} className={"multi-select-input"}
                               placeholder={placeholder ?? ""} readOnly></input>
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
        </div>

    </div>


}

const SelectionOption: React.FC<MenuItemType> = (props) => {

    const {children} = props

    return <>{children}</>
}

export default Object.assign(MultiSelect, {
    Option: SelectionOption,
})
