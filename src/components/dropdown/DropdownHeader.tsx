import React, {ReactNode} from "react";
import "./Dropdown.style.scss"

export interface DropdownHeaderType {
    children: ReactNode
}

/**
 * Component creates a separate header with border bottom
 * for further separation
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const DropdownHeader: React.FC<DropdownHeaderType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"dropdown__header"}>
        {children}
    </div>
}