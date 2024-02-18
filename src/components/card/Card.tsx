import React, {ReactElement} from "react";
import "./Card.style.scss"
import {CardImg, CardImgStyle} from "./CardImg";
import {CardHeader, CardHeaderType} from "./CardHeader";
import {CardTitle, CardTitleType} from "./CardTitle";
import {CardSubTitle, CardSubTitleType} from "./CardSubTitle";
import {CardFooter, CardFooterType} from "./CardFooter";
import {Color} from "../../utils/utils";

export type CardChildType = CardHeaderType | CardImgStyle | CardTitleType | CardSubTitleType | CardFooterType | any

export interface CardType {
    children: ReactElement<CardChildType> | ReactElement<CardChildType>[]
    //defaults to secondary
    color?: Color
}

const Card: React.FC<CardType> = (props) => {

    const {children, color = "secondary", ...args} = props

    return <div {...args} className={`card card--${color}`}>
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