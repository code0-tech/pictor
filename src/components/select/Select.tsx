import {getChild} from "../../utils/utils";
import {Selection} from "react-stately";
import React, {useState} from "react";
import {Key} from "react-aria";
import Menu, {MenuItemType} from "../menu/Menu";
import Input from "../input/Input";
import {IconSelector, TablerIconsProps} from "@tabler/icons-react";

export interface SelectType {
    children: React.ReactElement<SelectIconType & SelectOptionType>[] | React.ReactElement<SelectIconType & SelectOptionType>,
    defaultValue?: string,
    disabled?: boolean,
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

export interface SelectOptionType extends Omit<MenuItemType, "key"> {
    key?: Key,
    //Maybe needed in the future
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
                  const keys: Set<Key> = selection as Set<Key>
                  if (keys.size === 0 && props.disallowDeselection) return
                  let newSelection = keys.size === 0 ? new Set([""]) : selection
                  if (keys.size === 0) {
                      if (props.onDeselection) {
                          const event = handleDeselectionEvent(props.onDeselection);
                          if (event.isPrevented()) return
                          newSelection = event.getNewSelection();
                      }
                  } else {
                      if (props.onSelectionChange) {
                          const event = handleSelectionChangeEvent(selection, props.onSelectionChange);
                          if (event.isPrevented()) return
                          newSelection = event.getNewSelection();
                      }
                  }

                  setSelection(newSelection)
              }}>
            <Menu.Trigger>
                <InputComponent/>
            </Menu.Trigger>

            <Menu.Content>
                {
                    Array.of(props.children).flat().filter(child => child?.type === SelectionOption).map((child, index) => {
                        return <Menu.Item
                            key={child.props.children.toString()} {...child.props}>{child.props.children}</Menu.Item>
                    })
                }
            </Menu.Content>
        </Menu>


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
            return selectionArray[0];
        }
    };
};

const handleDeselectionEvent = (triggerMethod: (event: Event, newSelection: Selection) => void): Event => {
    const event = createCustomEvent(new Set([""]))
    triggerMethod(event, event.getNewSelection())
    return event
};

const handleSelectionChangeEvent = (newSelection: Selection, triggerMethod: (event: Event, selection: Selection) => void): Event => {
    const event = createCustomEvent(newSelection)
    triggerMethod(event, event.getNewSelection())
    return event
};

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
