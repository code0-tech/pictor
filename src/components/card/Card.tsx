import React, {ReactNode} from "react";
import "./Card.style.scss"
import {CardImg} from "./CardImg";

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
    Image: CardImg
})