import {Selection} from "react-stately"
import React, {useState} from "react"
import {Key} from "react-aria"
import Menu, {MenuItemType} from "../menu/Menu"
import Input from "../input/Input"
import {IconSelector, IconX, TablerIconsProps} from "@tabler/icons-react"
import Pill from "../pill/Pill";
import "./MultiSelect.style.scss"

export interface SelectType {
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
    onSelectionChange?: (event: SelectEvent, selection: Selection) => void, //this event is trigger if an element is changed
}

export interface SelectEvent {
    isPrevented: () => boolean,
    preventDefault: () => void,
    setNewSelection: (selection: Selection) => void,
    setNewSelectionAsStringArray: (selection: string[]) => void,
    getNewSelection: () => Selection,
    getNewSelectionAsStringArray: () => string[],
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
        error, placeholder
    } = props

    const [selection, setSelection] = useState<Selection>(new Set(defaultValue ? [defaultValue] : []))
    const selectedArray = [...selection] as string[]


    return <div className={"multi-select-wrapper"}>
        <div className={"multi-select-icon"}>
            {clearable && selectedArray[0] !== "" ? <IconX className={"xIcon"}/> : <IconSelector/>}
        </div>
        <div>
            {selectedArray.filter(entry => entry !== "").map((value, index) => {
                return <Pill key={index} removeButton onRemoveButtonClick={() => {
                    const newArray = selectedArray.filter(entry => entry !== value);
                    const newSelection = new Set(newArray.length === 0 ? [""] : newArray);

                    setSelection(newSelection)
                }}>
                    <Pill.Content>{value}</Pill.Content>
                </Pill>
            })}
            {disabled ? <Input disabled>
                    <Input.Control {...(label ? {label: label} : {label: ""})} placeholder={placeholder ?? ""}
                                   readOnly>
                        <Input.Control.Icon>
                            {clearable && selectedArray[0] !== "" ? <IconX className={"xIcon"}/> : <IconSelector/>}
                        </Input.Control.Icon>
                    </Input.Control>
                </Input> :
                <Menu defaultSelectedKeys={[defaultValue ?? ""]} selectionMode={"multiple"} selectedKeys={selection}
                      onSelectionChange={selection => {
                          const keys: Set<Key> = selection as Set<Key>
                          if (keys.size === 0 && disallowDeselection) return
                          let newSelection = keys.size === 0 ? new Set([""]) : selection
                          const event = handleSelectionChangeEvent(selection, onSelectionChange)
                          if (event.isPrevented()) return
                          newSelection = event.getNewSelection()
                          setSelection(newSelection)
                      }}>
                    <Menu.Trigger>
                        <input defaultValue={placeholder ?? ""} className={"multi-select-input"} placeholder={placeholder ?? ""} readOnly></input>
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

const createCustomEvent = (newSelection: Selection): SelectEvent => {
    let prevented = false
    let selection = newSelection
    return {
        isPrevented: () => prevented,
        preventDefault: () => {
            prevented = true
        },
        setNewSelection: (newSelection: Selection) => {
            selection = newSelection
        },
        setNewSelectionAsStringArray: (newSelection: string[]) => {
            selection = new Set(newSelection)
        },
        getNewSelection: (): Selection => {
            return selection
        },
        getNewSelectionAsStringArray: (): string[] => {
            return [...selection] as string[]
        }
    }
}

const handleDeselectionEvent = (triggerMethod: (event: SelectEvent, newSelection: Selection) => void): SelectEvent => {
    const event = createCustomEvent(new Set([""]))
    triggerMethod(event, event.getNewSelection())
    return event
}

const handleSelectionChangeEvent = (newSelection: Selection, triggerMethod: (event: SelectEvent, selection: Selection) => void): SelectEvent => {
    const event = createCustomEvent(newSelection)
    triggerMethod(event, event.getNewSelection())
    return event
}

const SelectionOption: React.FC<MenuItemType> = (props) => {

    const {children} = props

    return <>{children}</>
}

export default Object.assign(MultiSelect, {
    Option: SelectionOption,
})
