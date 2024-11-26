import React, {ReactElement, ReactNode} from "react";
import {getChild, getPositionAroundTarget} from "../../utils/utils";
import "./Tooltip.style.scss"

export interface DropdownType {
    children: ReactElement<TooltipTriggerType & TooltipMenuType>[],
    //defaults to 'bottom'
    position?: 'top' | 'bottom' | 'left' | 'right'
    //defaults to 'start'
    align?: 'start' | 'center' | 'end'
}

export interface TooltipTriggerType {
    children: ReactNode
}

export interface TooltipMenuType {
    children: ReactNode
}

const Tooltip: React.FC<DropdownType> = (props) => {

    const {position = "bottom", align = "start", children, ...args} = props
    const trigger = getChild(children, TooltipTrigger)
    const menu = getChild(children, TooltipMenu)

    /**
     * finds the head dropdown component because click target could be a
     * child component and we cant work with this
     */
    const getTooltipNodes = (target: HTMLElement): {
        tooltip: HTMLElement,
        trigger: HTMLElement,
        menu: HTMLElement
    } => {
        let tooltip = (target as HTMLDivElement).parentNode as HTMLElement
        while (!(tooltip.className.split(" ")[0] == "tooltip")) {
            tooltip = tooltip.parentNode as HTMLElement
        }

        return {
            tooltip,
            trigger: tooltip.querySelector(".tooltip__trigger") as HTMLElement,
            menu: tooltip.querySelector(".tooltip__menu") as HTMLElement
        }
    }

    /**
     * click listener that shows and removes the dropdown menu
     */
    const triggerOnMouseOver = (event: React.MouseEvent<HTMLElement>) => {

        const {tooltip, trigger, menu} = getTooltipNodes(event.target as HTMLElement)

        //show dropdown menu
        tooltip.classList.add("tooltip--active")

        const calculatePosition = () => {
            const calculatedPosition = getPositionAroundTarget(trigger, menu, position)
            menu.setAttribute("data-position", calculatedPosition.position)

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

        //change position of menu when screen is resized
        window.addEventListener("resize", function temp() {
            calculatePosition()
            if (!tooltip.classList.contains("tooltip--active"))
                window.removeEventListener("resize", temp)
        })

    }

    const triggerOnMouseOut = (event: React.MouseEvent<HTMLElement>) => {
        const {tooltip, trigger, menu} = getTooltipNodes(event.target as HTMLElement)
        //show dropdown menu
        tooltip.classList.remove("tooltip--active")
    }


    return <div className={"tooltip"} onMouseOver={triggerOnMouseOver} onMouseOut={triggerOnMouseOut} {...args}>
        {trigger}

        {/*calculate position based on props*/}
        {!!menu ? React.cloneElement(menu as ReactElement, {
            "style": {
                //left-right top-bottom
              "transform": position == "top" ? `translate(0px, 0px)` :
                         position == "right" ? `` :
                         position == "left" ? `` :
                         ``
            },
            "data-position": position,
            "data-align": align,
        }) : null}
    </div>
}

/**
 * Wrapper component for the trigger that activates or deactivates the
 * {@link TooltipMenu} component
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
const TooltipTrigger: React.FC<TooltipTriggerType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"tooltip__trigger"}>
        {children}
    </div>
}

/**
 * Component to create the menu that will open when the
 * {@link TooltipTrigger} is clicked
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
const TooltipMenu: React.FC<TooltipMenuType> = (props) => {

    const {children, ...args} = props

    //this stops the mousedown event from the window on the menu component
    const preventClickable = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    return <div {...args} className={"tooltip__menu"} onMouseDown={preventClickable}>
        {children}
    </div>
}

export default Object.assign(Tooltip, {
    Trigger: TooltipTrigger,
    Menu: TooltipMenu
})