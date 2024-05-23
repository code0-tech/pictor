import React, {cloneElement, ReactElement, ReactNode} from "react";
import {getChild, getPositionAroundTarget} from "../../utils/utils";
import "./Dropdown.style.scss"
import {DropdownHeader} from "./DropdownHeader";
import {DropdownFooter} from "./DropdownFooter";
import {DropdownItem} from "./DropdownItem";
import {DropdownItemGroup} from "./DropdownItemGroup";

export interface DropdownType {
    children: ReactElement<DropdownTriggerType & DropdownMenuType>[]
    //defaults to 'bottom'
    position?: 'top' | 'bottom' | 'left' | 'right'
    //defaults to 'start'
    align?: 'start' | 'center' | 'end'
    //defaults to 3 times the size of trigger
    maxWidthFactor?: number
}

export interface DropdownTriggerType {
    children: ReactNode
}

export interface DropdownMenuType {
    children: ReactNode
}

const Dropdown: React.FC<DropdownType> = (props) => {

    const {position = "bottom", align = "start", maxWidthFactor = 3, children, ...args} = props
    const trigger = getChild(children, DropdownTrigger)
    const menu = getChild(children, DropdownMenu)

    /**
     * finds the head dropdown component because click target could be a
     * child component and we cant work with this
     */
    const getDropdownNodes = (target: HTMLElement): {
        dropdown: HTMLElement,
        trigger: HTMLElement,
        menu: HTMLElement
    } => {
        let dropdown = (target as HTMLDivElement).parentNode as HTMLElement
        while (!(dropdown.className.split(" ")[0] == "dropdown")) {
            dropdown = dropdown.parentNode as HTMLElement
        }

        return {
            dropdown,
            trigger: dropdown.querySelector(".dropdown__trigger") as HTMLElement,
            menu: dropdown.querySelector(".dropdown__menu") as HTMLElement
        }
    }

    /**
     * click listener that shows and removes the dropdown menu
     */
    const triggerOnClick = (event: React.MouseEvent<HTMLElement>) => {

        const {dropdown, trigger, menu} = getDropdownNodes(event.target as HTMLElement)
        const isActive = dropdown.classList.contains("dropdown--active")

        //remove dropdown menu
        if (isActive) {
            dropdown.classList.remove("dropdown--active")
            menu.classList.remove("dropdown__menu--active")
            return
        }

        //show dropdown menu
        dropdown.classList.add("dropdown--active")
        menu.classList.add("dropdown__menu--active")

        const calculatePosition = () => {
            const calculatedPosition = getPositionAroundTarget(trigger, menu, position)
            menu.setAttribute("data-position", calculatedPosition.position)
            menu.style.maxWidth = `${trigger.offsetWidth * maxWidthFactor}px`
            if (calculatedPosition.position == "top" || calculatedPosition.position == "bottom") {
                const alignmentX = align == "start" ? calculatedPosition.x :
                                   align == "center" ? calculatedPosition.x - ((menu.offsetWidth - trigger.offsetWidth) / 2) :
                                   calculatedPosition.x - (menu.offsetWidth - trigger.offsetWidth)

                menu.style.transform = `translate(${alignmentX}px,${calculatedPosition.y}px)`
            } else {

                const alignmentY = align == "start" ? calculatedPosition.y :
                                   align == "center" ? calculatedPosition.y - ((menu.offsetHeight - trigger.offsetHeight) / 2) :
                                   calculatedPosition.y - (menu.offsetHeight - trigger.offsetHeight)

                menu.style.transform = `translate(${calculatedPosition.x}px,${alignmentY}px)`
            }
        }

        //calculate right position for the menu and set this as new attribute
        calculatePosition()

        //outside clicks that disables the dropdown
        window.addEventListener("mousedown", function temp(event) {

            if (!(trigger.contains((event.target as HTMLElement)))) {
                dropdown.classList.remove("dropdown--active")
                menu.classList.remove("dropdown__menu--active")
            }

            if (!dropdown.classList.contains("dropdown--active"))
                window.removeEventListener("mousedown", temp)
        })

        //change position of menu when d-screen is resized
        window.addEventListener("resize", function temp() {
            calculatePosition()
            if (!dropdown.classList.contains("dropdown--active"))
                window.removeEventListener("resize", temp)
        })

    }

    return <div className={"dropdown"} {...args}>
        {!!trigger && cloneElement(trigger as ReactElement, {
            "onClick": triggerOnClick
        })}

        {!!menu ? React.cloneElement(menu as ReactElement, {
            "data-position": position,
            "data-align": align,
        }) : null}
    </div>
}

/**
 * Wrapper component for the trigger that activates or deactivates the
 * {@link DropdownMenu} component
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
const DropdownTrigger: React.FC<DropdownTriggerType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"dropdown__trigger"}>
        {children}
    </div>
}

/**
 * Component to create the menu that will open when the
 * {@link DropdownTrigger} is clicked
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
const DropdownMenu: React.FC<DropdownMenuType> = (props) => {

    const {children, ...args} = props

    //this stops the mousedown event from the window on the menu component
    const preventClickable = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    return <div {...args} className={"dropdown__menu"} onMouseDown={preventClickable}>
        {children}
    </div>
}

export default Object.assign(Dropdown, {
    Trigger: DropdownTrigger,
    Menu: DropdownMenu,
    Header: DropdownHeader,
    Footer: DropdownFooter,
    Group: Object.assign(DropdownItemGroup, {
        Item: DropdownItem
    })
})