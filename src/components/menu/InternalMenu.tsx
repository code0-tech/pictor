import {AriaMenuProps, useMenu, useMenuItem, useMenuSection} from "react-aria";
import {Node, useTreeState} from "react-stately";
import React from "react";
import {TreeState} from "@react-stately/tree";
import {IconCheck} from "@tabler/icons-react";
import "./Menu.style.scss"
import {MenuItemType, MenuSectionType} from "./Menu";

export function InternalMenu<T extends object>(props: AriaMenuProps<T>) {

    const dummyState = useTreeState(props);
    const disabledKeys = [...dummyState.collection.getKeys()].map(key => dummyState.collection.getItem(key)).filter(item => {
        return item?.props.disabled || item?.props.unselectable
    }).map(item => item?.key ?? "")

    const state = useTreeState({
        ...props,
        disabledKeys
    });

    // Get props for the menu element
    const ref = React.useRef(null);
    const {menuProps} = useMenu({
        ...props,
        disabledKeys
    }, state, ref);

    return (
        <ul {...menuProps} ref={ref} className={"menu"}>
            {[...state.collection].map((item) => (
                item.type === 'section' ? <MenuSection key={item.key} section={item} state={state}/>
                                        : <InternalMenuItem key={item.key} item={item} state={state}/>
            ))}
        </ul>
    );
}

function InternalMenuItem<T>({item, state}: {item: Node<T>, state: TreeState<T>}) {

    const {color = "secondary", disabled = false, unselectable = false} = item.props as MenuItemType

    // Get props for the menu item element
    const ref = React.useRef(null);
    const {menuItemProps, isSelected} = useMenuItem(
        {key: item.key},
        state,
        ref
    )

    return (
        <li {...(!disabled ? {...menuItemProps} : {})} ref={ref} className={`menu__item menu__item--${color} ${disabled && "menu__item--disabled"} ${unselectable && "menu__item--unselectable"}`}>

            <div>{item.rendered}</div>
            {isSelected && !unselectable ? <IconCheck size={16} style={{marginLeft: ".5rem"}}/> : menuItemProps.role != "menuitem" ? <IconCheck size={16} style={{marginLeft: ".5rem", opacity: 0}}/> : null}
        </li>
    )
}

function MenuSection<T>({section, state}: {section: Node<T>, state: TreeState<T>}) {

    const {title} = section.props as MenuSectionType
    // Get props for the menu item element
    const ref = React.useRef(null);
    const { itemProps, headingProps, groupProps } = useMenuSection({
        heading: section.rendered,
        'aria-label': section['aria-label']
    });

    /**const children = [...state.collection.getKeys()].map((value) => {
        return state.collection.getItem(value)
    }).filter(item => item?.parentKey == section.key) as Node<any>[]**/

    return <ul {...groupProps} className={"menu__section"}>
        {title && <span className={"menu__section-title"}>{title}</span>}
        {[...section.childNodes].map((node) => (
            <InternalMenuItem
                key={node.key}
                item={node}
                state={state}
            />
        ))}
    </ul>
}