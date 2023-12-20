import React, {ReactNode} from "react";
import "./Card.style.scss"

export interface CardTitleType {
    children: string
}

/**
 * Component creates a title for card component
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const CardTitle: React.FC<CardTitleType> = (props) => {

    const {children, ...args} = props

    return <h4 {...args} className={"card__title"}>
        {children}
    </h4>
}