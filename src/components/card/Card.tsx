import React, {ReactNode} from "react";
import "./Card.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";


export interface CardType extends Code0Component<HTMLDivElement> {
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


export interface SectionType extends Code0Component<HTMLDivElement> {
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
        <div {...mergeCode0Props(`card ${outline ? "card--outline" : ""} ${gradient ? "card--gradient" : ""} ${gradient ? `card--gradient-${gradientPosition}` : ""} card--${color} card--${variant}`, args)}>
            {children}
        </div>
    </>
}

const CardSection: React.FC<SectionType> = (props) => {

    const {
        image = false,
        border = false,
        children,
        ...args
    } = props;

    return <>
        <div {...mergeCode0Props(`card__section ${border ? "card__section--border" : ""} ${image ? "card__section--image" : ""}`, args)}>
            {children}
        </div>
    </>
}


export default Object.assign(Card, {
    Section: CardSection,
})