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

    const {targetItems, targetStep, minStart} = React.useMemo(() => {
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


            for (let i = 0; i < groups.length; i++) {
                const group = groups[i]
                const newStep = (group.step + itemDuration) / 1.75
                const lowerBound = (group.step / 3) - 10
                const upperBound = (group.step * 3) + 10

                if (lowerBound < itemDuration && itemDuration < upperBound) {
                    group.step = newStep
                    group.items.push(item)
                    itemAdded = true
                    break
                }
            }

            if (!itemAdded) {
                groups.push({step: itemDuration, items: [item]})
            }

        })

        groups.sort((a, b) => b.step - a.step).forEach((group, index) => {

            if (index > 0) {
                let minStart = Infinity
                let maxEnd = -Infinity
                for (let i = 0; i < group.items.length; i++) {
                    const it = group.items[i]
                    if (it.start < minStart) minStart = it.start
                    if (it.end > maxEnd) maxEnd = it.end
                }
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

        let minStart = Infinity
        const firstItems = groups[0].items
        for (let i = 0; i < firstItems.length; i++) {
            if (firstItems[i].start < minStart) minStart = firstItems[i].start
        }

        return {
            targetItems: firstItems,
            targetStep: groups[0].step,
            minStart,
        }
    }, [items, step])

    return (
        <ScrollArea w={"100%"} h={"100%"} type={"hover"}>
            <ScrollAreaViewport>
                <GanttGroup children={children}
                            id={`group-target`}
                            hideScaling={false}
                            start={minStart - (((minStart / (targetStep * step)) * (targetStep * step)))}
                            step={targetStep * step}
                            stepWidth={stepWidth} rowHeight={rowHeight} items={targetItems}
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
