import React, {CSSProperties} from "react"
import {Component, hashToColor} from "../../utils"
import "./Gantt.style.scss"
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea"
import {GanttGroup} from "./GanttGroup"
import {GanttItem} from "./GanttItem"

export interface GanttProps extends Omit<Component<HTMLDivElement>, 'children'> {
    items: GanttItem[]
    stepWidth?: CSSProperties["width"]
    rowHeight?: CSSProperties["height"]
    step?: number
    children?: (item: GanttItem, index: number) => React.ReactNode
}

export const Gantt: React.FC<GanttProps> = (props) => {

    const {items, stepWidth = "50px", rowHeight = "50px", step = 1, children} = props

    const groups: {
        step: number
        items: GanttItem[]
    }[] = []

    items?.forEach(item => {

        const itemDuration = item.end - item.start
        let itemAdded = false

        if (groups.length <= 0) {
            groups.push({step: itemDuration, items: [item]})
            return
        }


        groups.forEach((group) => {
            const newStep = (group.step + itemDuration) / 1.75
            const lowerBound = (group.step / 3) - 10
            const upperBound = (group.step * 3) + 10

            if (lowerBound < itemDuration && itemDuration < upperBound && !itemAdded) {
                group.step = newStep
                group.items.push(item)
                itemAdded = true
            }
        })

        if (!itemAdded) {
            groups.push({step: itemDuration, items: [item]})
        }

    })

    groups.sort((a, b) => b.step - a.step).forEach((group, index) => {

        if (index > 0) {
            const minStart = Math.min(...group.items.map(item => item.start))
            const maxEnd = Math.max(...group.items.map(item => item.end))
            groups[0].items.push({
                start: minStart,
                end: (maxEnd + ((groups[0].step * step) / 6)),
                id: `group-source-${index}`,
                type: "group",
                data: {
                    items: group.items,
                    step: step,
                    firstGroupStep: groups[0].step,
                    groupStep: group.step,
                    displayMessage: `${index}`,
                    color: hashToColor(`group-source-${index}`),
                }
            })
        }

    })

    const minStart = Math.min(...groups[0].items.map(item => item.start))

    return (
        <ScrollArea w={"100%"} h={"100%"} type={"hover"}>
            <ScrollAreaViewport>
                <GanttGroup children={children}
                            id={`group-target`}
                            hideScaling={false}
                            start={minStart - (((minStart / (groups[0].step * step)) * (groups[0].step * step)))}
                            step={groups[0].step * step}
                            stepWidth={stepWidth} rowHeight={rowHeight} items={groups[0].items}
                            key={`group-target`}/>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"horizontal"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>
    )
}

export const getRelativeValue = (value: number): string => {
    const realValue = value > 500_000 ? value / 1_000_000 : value > 500 ? value / 1000 : value
    const label = value > 500_000 ? "s" : value > 500 ? "ms" : "μs"
    const roundedValue = Math.round(realValue * 10) / 10

    return `${roundedValue}${label}`
}
