import React, {ReactNode} from "react";
import "./Dropdown.style.scss"

export interface DropdownFooterType {
    children: ReactNode
}

/**
 * Component creates a separate footer with border top
 * for further separation
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const DropdownFooter: React.FC<DropdownFooterType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"dropdown__footer"}>
        {children}
    </div>
}