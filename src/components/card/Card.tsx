import React, {HTMLProps, ReactElement, ReactNode} from "react";
import "./Card.style.scss"
import {Color, Size} from "../../utils/types";


export interface CardType extends HTMLProps<HTMLDivElement> {
    children: ReactNode | ReactNode[]
    //defaults to secondary
    color?: Color,
    //defaults to normal
    variant?: "none" | "normal" | "outlined" | "filled",
    //defaults to false
    gradient?: boolean,
    //defaults to top-right
    gradientPosition?: "top-left" | "top-right" | "bottom-right" | "bottom-left"
    //defaults to false
    outline?: boolean
}


export interface SectionType {
    children: ReactNode | ReactNode[]
    //defaults to false
    image?: boolean,
    //defaults to false
    border?: boolean
}


const Card: React.FC<CardType> = (props) => {

    const {
        children,
        color = "secondary",
        variant = "normal",
        gradient = false,
        gradientPosition = "top-right",
        outline = false,
        ...args
    } = props

    return <>
        <div {...args}
             className={`card ${outline && "card--outline"} ${gradient && "card--gradient"} ${gradient && `card--gradient-${gradientPosition}`} card--${color} card--${variant}`}>
            {children}
        </div>
    </>
}

const CardSection: React.FC<SectionType> = (props) => {

    const {
        image = false,
        border = false,
        children
    } = props;

    return <>
        <div
            className={`card__section ${border ? "card__section--border" : ""} ${image ? "card__section--image" : ""}`}>{children}</div>
    </>
}


export default Object.assign(Card, {
    Section: CardSection,
})