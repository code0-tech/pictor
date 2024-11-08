import React, {ReactNode} from "react";
import "./Card.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";


export interface CardType extends Code0Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
    //defaults to secondary
    color?: Color,
    //defaults to normal
    variant?: "none" | "normal" | "outlined" | "filled"
    //defaults to false
    gradient?: boolean,
    firstGradientColor?: Color
    secondGradientColor?: Color
    borderColor?: Color
    //defaults to false
    outline?: boolean
}


const Card: React.FC<CardType> = (props) => {

    const {
        children,
        color = "secondary",
        variant = "normal",
        gradient = false,
        firstGradientColor = "info",
        secondGradientColor = "secondary",
        borderColor = "info",
        outline = false,
        ...args
    } = props

    return <>
        <div {...mergeCode0Props(
            `
                    card 
                    card--${color} card--${variant}
                    ${outline ? "card--outline" : ""} 
                    ${gradient ? "card--gradient" : ""} 
                    ${borderColor ? `card--border-${borderColor}` : ""} 
                    ${gradient ? `card--gradient--${firstGradientColor}-${secondGradientColor}` : ""} 
               `
            , args)}>
            {children}
        </div>
    </>
}


export default Card