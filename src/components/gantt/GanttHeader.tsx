import React, {CSSProperties} from "react"
import {Component, mergeComponentProps} from "../../utils"
import {Text} from "../text/Text"

export interface GanttHeaderProps extends Component<HTMLDivElement> {
    columnCount: number
    start: number
    step: number
    avgDuration: number
    stepWidth: CSSProperties["width"]
}

export const GanttHeader: React.FC<GanttHeaderProps> = (props) => {

    const {columnCount, start, step, avgDuration, stepWidth, ...rest} = props

    const stepWidthPx = parseInt(stepWidth as string)

    return <div {...mergeComponentProps("gantt__header", rest)}>
        {Array.from({length: columnCount}).map((_, columnIndex) => {
            const timelineValue = start + columnIndex * step
            const shouldShowLabel = columnIndex % 4 === 0
            const label = getTimelineLabel(avgDuration)
            const {value, unit} = getTimelineLabel(timelineValue)
            const displayValue = `${Math.round(value * 10) / 10}${unit}`

            return columnIndex !== 0 ? (
                <div
                    key={`header-${columnIndex}`}
                    className={"gantt__header-column"}
                    style={{
                        left: columnIndex * stepWidthPx,
                        width: stepWidth
                    }}
                >
                    <Text>
                        {shouldShowLabel ? displayValue : ""}
                    </Text>
                </div>
            ) : (
                <div key={`header-${columnIndex}`} className={"gantt__header-label-column"}>
                    <Text className={"gantt__header-label"}>
                        Range in {label.unit}
                    </Text>
                </div>
            )
        })}
    </div>
}

const getTimelineLabel = (duration: number): { value: number, unit: string } => {
    if (duration > 500_000) {
        return {value: duration / 1_000_000, unit: "s"}
    }
    if (duration > 500) {
        return {value: duration / 1_000, unit: "ms"}
    }
    return {value: duration, unit: "μs"}
}