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

    const stepWidthPx = React.useMemo(() => parseInt(stepWidth as string), [stepWidth])
    const label = React.useMemo(() => getTimelineLabel(avgDuration), [avgDuration])
    const columns = React.useMemo(() => Array.from({length: columnCount}), [columnCount])

    return <div {...mergeComponentProps("gantt__header", rest)}>
        {columns.map((_, columnIndex) => {
            if (columnIndex === 0) {
                return (
                    <div key={`header-${columnIndex}`} className={"gantt__header-label-column"}>
                        <Text className={"gantt__header-label"}>
                            Range in {label.unit}
                        </Text>
                    </div>
                )
            }

            const shouldShowLabel = columnIndex % 4 === 0
            let displayValue = ""
            if (shouldShowLabel) {
                const timelineValue = start + columnIndex * step
                const {value, unit} = getTimelineLabel(timelineValue)
                displayValue = `${Math.round(value * 10) / 10}${unit}`
            }

            return (
                <div
                    key={`header-${columnIndex}`}
                    className={"gantt__header-column"}
                    style={{
                        left: columnIndex * stepWidthPx,
                        width: stepWidth
                    }}
                >
                    <Text>
                        {displayValue}
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