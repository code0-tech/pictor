import {getChild} from "../../utils/utils"
import {Selection} from "react-stately"
import React, {useState} from "react"
import {Key} from "react-aria"
import Menu, {MenuItemType} from "../menu/Menu"
import Input from "../input/Input"
import {IconSelector, IconX, TablerIconsProps} from "@tabler/icons-react"
import {windows} from "rimraf";
import "./Select.style.scss"

export interface SelectType {
    children: React.ReactElement<SelectIconType & MenuItemType>[] | React.ReactElement<SelectIconType & MenuItemType>,
    defaultValue?: string, //Default value for the selection, if the value doesn't exist the value is still displayed in the select (don't use values which doesn't exist)
    disabled?: boolean, //If true the select is disabled and cant be used
    clearable?: boolean, //Adds an icon to clear the current selection
    label?: string, //A text which is displayed above the input to give a short description
    error?: React.ReactNode, //A Node which is displayed as an error
    success?: React.ReactNode, //A Node which is displayed as a success
    description?: string, //A description for the input
    disallowDeselection?: boolean, //If true the user cant deselect an element
    onDeselection?: (event: SelectEvent) => void, //this event is trigger if an element is deselected
    onSelectionChange?: (event: SelectEvent, selection: Selection) => void, //this event is trigger if an element is changed
}

export interface SelectEvent {
    isPrevented: () => boolean,
    preventDefault: () => void,
    setNewSelection: (selection: Selection) => void,
    setNewSelectionAsString: (selection: string) => void,
    getNewSelection: () => Selection,
    getNewSelectionAsString: () => string,
}

export interface SelectIconType {
    children: TablerIconsProps
}

//TODO implement label-, description-, error- and SuccessMessages
//These components dont exists, waiting for Nico

const Select: React.FC<SelectType> = (props) => {
    const {
        disabled = false, clearable = false, defaultValue,
        onSelectionChange = () => {
        }, onDeselection = () => {
        },
        children, label, disallowDeselection = false,
        success, description,
        error
    } = props

    const [selection, setSelection] = useState<Selection>(new Set([defaultValue ?? ""]))
    const selectedArray = [...selection] as string[]

    const InputComponent: React.FC<any> = (otherProps) => {
        return <div onClick={event => {
            if (children && selectedArray[0] !== "") {
                if ((event.target as HTMLDivElement).className.includes("input__control")) setSelection(new Set([""]))
            }
        }}>
            <Input {...otherProps}>
                <Input.Control {...(label ? {label: label} : {label: ""})} placeholder={selectedArray[0]}
                               value={selectedArray[0]} readOnly>
                    <Input.Control.Icon>{clearable && selectedArray[0] !== "" ? <IconX className={"xIcon"}/> :
                        <IconSelector/>}</Input.Control.Icon>
                </Input.Control>
            </Input>
        </div>
    }

    return <>
        {disabled ? <InputComponent disabled/> :
            <Menu defaultSelectedKeys={[defaultValue ?? ""]} selectionMode={"single"} selectedKeys={selection}
                  onSelectionChange={selection => {
                      const keys: Set<Key> = selection as Set<Key>
                      if (keys.size === 0 && disallowDeselection) return
                      let newSelection = keys.size === 0 ? new Set([""]) : selection
                      if (keys.size === 0) {
                          const event = handleDeselectionEvent(onDeselection)
                          if (event.isPrevented()) return
                          newSelection = event.getNewSelection()

                      } else {
                          const event = handleSelectionChangeEvent(selection, onSelectionChange)
                          if (event.isPrevented()) return
                          newSelection = event.getNewSelection()
                      }
                      setSelection(newSelection)
                  }}>
                <Menu.Trigger>
                    <InputComponent/>
                </Menu.Trigger>

                <Menu.Content>
                    {
                        Array.of(props.children).flat().filter(child => child?.type === SelectionOption).map((child, index) => {
                            return <Menu.Item {...child.props}
                                              key={child.key ?? index}>{child.props.children}</Menu.Item>
                        })
                    }
                </Menu.Content>
            </Menu>
        }
    </>


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
        setNewSelectionAsString: (newSelection: string) => {
            selection = new Set([newSelection])
        },
        getNewSelection: (): Selection => {
            return selection
        },
        getNewSelectionAsString: (): string => {
            const selectionArray = [...selection] as string[]
            return selectionArray[0]
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

export default Object.assign(Select, {
    Option: SelectionOption,
})
