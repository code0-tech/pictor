import React, {CSSProperties} from "react"
import {Component, mergeComponentProps} from "../../utils"
import {Text} from "../text/Text"
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react"

export interface GanttHeaderProps extends Component<HTMLDivElement> {
    columnCount: number
    start: number
    step: number
    avgDuration: number
    stepWidth: CSSProperties["width"]
    canScrollLeft?: boolean
    canScrollRight?: boolean
    // Maps a column index to the actual time shown in its label. Defaults to a
    // linear mapping; the Gantt passes a compressed mapping so labels jump over
    // collapsed gaps.
    timeAtColumn?: (columnIndex: number) => number
}

export const GanttHeader: React.FC<GanttHeaderProps> = (props) => {

    const {
        columnCount,
        start,
        step,
        avgDuration,
        stepWidth,
        canScrollLeft,
        canScrollRight,
        timeAtColumn,
        ...rest
    } = props

    const stepWidthPx = React.useMemo(() => parseInt(stepWidth as string), [stepWidth])
    const label = React.useMemo(() => getTimelineLabel(avgDuration), [avgDuration])
    const columns = React.useMemo(() => Array.from({length: columnCount}), [columnCount])

    const jumpColumns = React.useMemo(() => {
        if (!timeAtColumn) return new Set<number>()
        const jumps = new Set<number>()
        for (let i = 1; i < columnCount; i++) {
            if (timeAtColumn(i) - timeAtColumn(i - 1) > step * 1.5) jumps.add(i)
        }
        return jumps
    }, [timeAtColumn, columnCount, step])

    const nearJump = (columnIndex: number) => {
        for (let d = -2; d <= 2; d++) if (jumpColumns.has(columnIndex + d)) return true
        return false
    }

    return <div {...mergeComponentProps("gantt__header", rest)}>
        {canScrollLeft && (
            <div className={"gantt__header-scroll gantt__header-scroll--left"}>
                <IconChevronLeft size={16}/>
            </div>
        )}
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

            const timelineValue = timeAtColumn ? timeAtColumn(columnIndex) : start + columnIndex * step

            // The jump column (end of a compressed gap) always gets a label so it
            // aligns with the item after the gap; regular cadence labels next to a
            // jump are dropped so we don't render two near-identical values.
            const isJump = jumpColumns.has(columnIndex)
            const shouldShowLabel = isJump || (columnIndex % 4 === 0 && !nearJump(columnIndex))

            let displayValue = ""
            if (shouldShowLabel) {
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
        {canScrollRight && (
            <div className={"gantt__header-scroll gantt__header-scroll--right"}>
                <IconChevronRight size={16}/>
            </div>
        )}
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