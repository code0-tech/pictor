import React, {ReactNode} from "react";
import "./Dropdown.style.scss"

export interface DropdownItemType {
    children: ReactNode
}

/**
 * Component creates an item with over effect
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const DropdownItem: React.FC<DropdownItemType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"dropdown__item"}>
        {children}
    </div>
}