import React, {ReactNode} from "react";
import "./Card.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";


export interface Card extends Code0Component<HTMLDivElement> {
    children: ReactNode | ReactNode[]
    //defaults to secondary
    color?: Color,
    //defaults to normal
    variant?: "none" | "normal" | "outlined" | "filled"
    //defaults to false
    gradient?: boolean,
    //defaults to secondary
    gradientColor?: Color
    //defaults to secondary
    borderColor?: Color
    //defaults to false
    outline?: boolean
    //defaults to secondary
    outlineColor?: Color
    //defaults to false
    dashed?: boolean
}


const Card: React.FC<Card> = (props) => {

    const {
        children,
        color = "secondary",
        variant = "normal",
        gradient = false,
        gradientColor = "secondary",
        borderColor = "secondary",
        outlineColor = "secondary",
        outline = false,
        dashed = false,
        ...args
    } = props

    return <>
        <div {...mergeCode0Props(
            `
                    card 
                    card--${color} card--${variant}
                    ${outline ? `card--outline-${outlineColor}` : ""} 
                    ${gradient ? "card--gradient" : ""} 
                    ${borderColor ? `card--border-${borderColor}` : ""} 
                    ${dashed ? `card--border--dashed` : ""} 
                    ${gradient ? `card--gradient-${gradientColor}` : ""} 
               `
            , args)}>
            {children}
        </div>
    </>
}


export default Card