import {getChild} from "../../utils/utils"
import {Selection} from "react-stately"
import React, {useState} from "react"
import {Key} from "react-aria"
import Menu, {MenuItemType} from "../menu/Menu"
import Input from "../input/Input"
import {IconSelector, TablerIconsProps} from "@tabler/icons-react"

export interface SelectType {
    children: React.ReactElement<SelectIconType & MenuItemType>[] | React.ReactElement<SelectIconType & MenuItemType>,
    defaultValue?: string,
    disabled?: boolean,
    clearable?: boolean,
    label?: string,
    error?: React.ReactNode,
    success?: React.ReactNode,
    description?: string,
    disallowDeselection?: boolean,
    onDeselection?: (event: Event) => void,
    onSelectionChange?: (event: Event, selection: Selection) => void,
}

export interface Event {
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

//TODO implement label-, description-, error- and SuccessMessages, also need to implement clearable
//These components doesnt exists, waiting for Nico

const Select: React.FC<SelectType> = (props) => {

    const [selection, setSelection] = useState<Selection>(new Set([props.defaultValue ?? ""]))
    const selectedArray = [...selection] as string[]

    const InputComponent: React.FC<any> = (otherProps) => {
        return <>
            <Input {...otherProps}>
                <Input.Control placeholder={selectedArray[0]} value={selectedArray[0]} readOnly></Input.Control>
            </Input>
        </>
    }

    return <>
        {props.disabled ? <InputComponent disabled/> :
            <Menu defaultSelectedKeys={[props.defaultValue ?? ""]} selectionMode={"single"} selectedKeys={selection}
                  onSelectionChange={selection => {
                      const keys: Set<Key> = selection as Set<Key>
                      if (keys.size === 0 && props.disallowDeselection) return
                      let newSelection = keys.size === 0 ? new Set([""]) : selection
                      if (keys.size === 0) {
                          if (props.onDeselection) {
                              const event = handleDeselectionEvent(props.onDeselection)
                              if (event.isPrevented()) return
                              newSelection = event.getNewSelection()
                          }
                      } else {
                          if (props.onSelectionChange) {
                              const event = handleSelectionChangeEvent(selection, props.onSelectionChange)
                              if (event.isPrevented()) return
                              newSelection = event.getNewSelection()
                          }
                      }
                      console.log(newSelection)
                      setSelection(newSelection)
                  }}>
                <Menu.Trigger>
                    <InputComponent/>
                </Menu.Trigger>

                <Menu.Content>
                    {
                        Array.of(props.children).flat().filter(child => child?.type === SelectionOption).map((child, index) => {
                            return <Menu.Item {...child.props} key={child.key ?? index}>{child.props.children}</Menu.Item>
                        })
                    }
                </Menu.Content>
            </Menu>
        }
    </>


}

const createCustomEvent = (newSelection: Selection): Event => {
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

const handleDeselectionEvent = (triggerMethod: (event: Event, newSelection: Selection) => void): Event => {
    const event = createCustomEvent(new Set([""]))
    triggerMethod(event, event.getNewSelection())
    return event
}

const handleSelectionChangeEvent = (newSelection: Selection, triggerMethod: (event: Event, selection: Selection) => void): Event => {
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
