import React, {ReactNode} from "react";
import "./Card.style.scss"

export interface CardHeaderType {
    children: ReactNode
}

/**
 * Component creates a separate header with border bottom
 * for further separation
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const CardHeader: React.FC<CardHeaderType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"card__header"}>
        {children}
    </div>
}