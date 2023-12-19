import React, {ReactElement} from "react";
import "./Card.style.scss"
import {CardImg, CardImgStyle} from "./CardImg";
import {CardHeader, CardHeaderType} from "./CardHeader";
import {CardTitle, CardTitleType} from "./CardTitle";
import {CardSubTitle, CardSubTitleType} from "./CardSubTitle";
import {CardFooter, CardFooterType} from "./CardFooter";

export type CardChildType = CardHeaderType | CardImgStyle | CardTitleType | CardSubTitleType | CardFooterType | any

export interface CardType {
    children: ReactElement<CardChildType> | ReactElement<CardChildType>[]
    //defaults to secondary
    variant?: "primary" | "secondary" | "info" | "success" | "warning" | "error",
}

const Card: React.FC<CardType> = (props) => {

    const {children, variant = "secondary", ...args} = props

    return <div {...args} className={`card card--${variant}`}>
        {children}
    </div>
}

export default Object.assign(Card, {
    Image: CardImg,
    Header: CardHeader,
    Footer: CardFooter,
    Title: CardTitle,
    Subtitle: CardSubTitle
})