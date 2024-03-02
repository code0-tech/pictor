import React, {useEffect, useRef, useState} from "react";
import Card, {CardType} from "../card/Card";
import "./Cardstack.style.scss"


export interface CardStackType {
    children: React.ReactElement<CardType>[]
}

export const CardStack: React.FC<CardStackType> = (props) => {
    const ref = useRef<HTMLDivElement>(null)
    const [currentCard, setCurrentCard] = useState<{index: number, width: string, height: string}>()
    const {children}  = props

    useEffect(() => {
        setInterval(() => {
            setCurrentCard((prev) => {
                const newIndex = !prev ? 0 : prev.index + 1 > children.length - 1 ? 0 :  prev.index + 1;
                return {
                    index: newIndex,
                    width: ref.current?.style.width ?? "",
                    height: ref.current?.style.height ?? "",
                };
            })
        }, 5000)
    }, [])

    return <>
        <div className={"cardstack"}>
            {Array.from({length: Math.min(children.length, 3)}).map((value, index, array) => {
                if (index == 0) {
                    const topCard = children.at(currentCard ? currentCard.index : -1);
                    return topCard && React.cloneElement(topCard, {ref: ref})
                }
                return <div className={`cardstack__${index}`}>
                    <Card {...children.at(index)?.props} style={{
                            width: currentCard?.width,
                            height: currentCard?.height}}>

                    </Card>
                </div>
            })
            }
        </div>
    </>
}



export default Object.assign(CardStack, {
});