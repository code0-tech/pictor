import React, {useEffect, useState} from "react";
import Card, {CardType} from "../card/Card";
import "./Cardstack.style.scss"


export interface CardStackType {
    backgroundShown?: 1 | 2 | 3
    children: React.ReactElement<CardType>[]
}

export const CardStack: React.FC<CardStackType> = (props) => {
    const [currentCard, setCurrentCard] = useState<number>(0)
    const {backgroundShown= 3, children}  = props

    useEffect(() => {
        setInterval(() => {
            setCurrentCard((prev) => {
                if (prev + 1 > children.length - 1) return 0;
                return prev + 1;
            })
        }, 5000)
    }, [])

    return <>
        <div className={"cardstack"}>
            {Array.from({length: backgroundShown}).map((value, index, array) => {
                console.log(index)
                return <div className={`cardstack__${index}`}>
                    {children.at(currentCard)}
                </div>
            })
            }
        </div>
    </>
}



export default Object.assign(CardStack, {
});