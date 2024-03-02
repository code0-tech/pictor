import React, {RefObject, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Card, {CardType} from "../card/Card";
import "./Cardstack.style.scss"


export interface CardStackType {
    children: React.ReactElement<CardType>[]
}

export const CardStack: React.FC<CardStackType> = (props) => {
    const {children} = props

    const [firstCard, setFirstCard] = useState<number>(0)

    useEffect(() => {
        setTimeout(() => {
            setFirstCard((prev) => {
                return prev + 1 > children.length - 1 ? 0 : prev + 1;
            })
        }, 5000)
    }, [firstCard])


    return <div className={"card-stack"}>
        {Array.from({length: Math.min(children.length, 3)}).map((_, index) => {

            if (index == 0) {
                return children.at(firstCard);
            }

            const currentCard = children.at(index)?.props as CardType;
            return <div key={index} className={`card-stack__card card-stack__card--${index}`}>
                <Card color={currentCard.color} gradient={currentCard.gradient}
                      gradientPosition={currentCard.gradientPosition} variant={currentCard.variant}
                      style={{
                          padding: 0,
                      }}>
                </Card>
            </div>
        })
        }
    </div>
}


export default CardStack