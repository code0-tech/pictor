import React, {HTMLProps, ReactElement, ReactNode} from "react";
import "./Card.style.scss"
import {Color, Size} from "../../utils/types";


export interface CardType extends HTMLProps<HTMLDivElement>{
    children: ReactElement[]
    //defaults to secondary
    color?: Color,
    //defaults to normal
    variant?: "none" | "normal" | "outlined" | "filled" | "gradient",
    //defaults to top-right
    gradient?: "top-left" | "top-right" | "bottom-right" | "bottom-left"
}



export interface SectionType {
    children: ReactNode | ReactNode[]
    //defaults to true
    withoutPadding?: boolean,
    //defaults to false
    image?: boolean,
}


const Card: React.FC<CardType> = (props) => {

    const {children, color = "secondary", variant = "normal", gradient= "top-right", ...args} = props

    return <>
        <div {...args} className={`card ${variant == "gradient" ? `card--gradient-${gradient}` : ""} card--${color} card--${variant} `}>
            {props.children}
        </div>
    </>
}

const CardSection: React.FC<SectionType> = (props) => {
    const {withoutPadding = true, image = false} = props;

    return <>
        <div
            className={`card__section ${props.image ? "card__section--image" : ""} ${withoutPadding ? "card__section--no-padding" : ""}`}>{props.children}</div>
    </>
}


export default Object.assign(Card, {
    Section: CardSection,
})