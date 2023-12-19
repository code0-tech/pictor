import React, {ReactNode} from "react";
import "./Card.style.scss"

export interface CardFooterType {
    children: ReactNode
}

/**
 * Component creates a separate footer with border bottom
 * for further separation
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const CardFooter: React.FC<CardFooterType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"card__footer"}>
        {children}
    </div>
}