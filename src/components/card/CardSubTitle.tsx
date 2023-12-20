import React, {ReactNode} from "react";
import "./Card.style.scss"

export interface CardSubTitleType {
    children: string
}

/**
 * Component creates a sub title for card component
 *
 * @author Nico Sammito
 * @since 0.1.0
 */
export const CardSubTitle: React.FC<CardSubTitleType> = (props) => {

    const {children, ...args} = props

    return <h5 {...args} className={"card__sub-title"}>
        {children}
    </h5>
}