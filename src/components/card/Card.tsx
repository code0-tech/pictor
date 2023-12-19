import React, {ReactNode} from "react";
import "./Card.style.scss"
import {CardImg} from "./CardImg";
import {CardHeader} from "./CardHeader";
import {CardTitle} from "./CardTitle";
import {CardSubTitle} from "./CardSubTitle";

export interface CardType {
    children: ReactNode | ReactNode[]
}

const Card: React.FC<CardType> = (props) => {

    const {children, ...args} = props

    return <div {...args} className={"card"}>
        {children}
    </div>
}

export default Object.assign(Card, {
    Image: CardImg,
    Header: CardHeader,
    Title: CardTitle,
    Subtitle: CardSubTitle
})