import React, {CSSProperties} from "react"
import {Component, mergeComponentProps} from "../../utils"
import {Text} from "../text/Text"
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react"

export interface GanttHeaderProps extends Component<HTMLDivElement> {
    avgDuration: number
    stepWidth: CSSProperties["width"]
    canScrollLeft?: boolean
    canScrollRight?: boolean
    // Round time values with their pixel offset on the (possibly compressed)
    // timeline. Positions come from the same scale the items use, so a label sits
    // exactly on the time it names.
    ticks: { time: number, left: number }[]
    // Spacing between two ticks, in raw time units. Drives how many decimals a
    // label needs to stay distinguishable from its neighbours.
    interval: number
}

export const GanttHeader: React.FC<GanttHeaderProps> = (props) => {

    const {
        avgDuration,
        stepWidth,
        canScrollLeft,
        canScrollRight,
        ticks,
        interval,
        ...rest
    } = props

    const label = React.useMemo(() => getTimelineLabel(avgDuration), [avgDuration])

    const formatTick = (time: number) => {
        const {value, unit} = getTimelineLabel(time)
        const decimals = Math.max(0, Math.ceil(-Math.log10(interval / unitFactor(unit))))
        return `${parseFloat(value.toFixed(decimals))}${unit}`
    }

    return <div {...mergeComponentProps("gantt__header", rest)}>
        {/* Chevron and label share one sticky block so the indicator sits next to
            the label instead of on top of it. */}
        <div className={"gantt__header-start"}>
            {canScrollLeft && (
                <div className={"gantt__header-scroll gantt__header-scroll--left"}>
                    <IconChevronLeft size={16}/>
                </div>
            )}
            <div className={"gantt__header-label-column"}>
                <Text className={"gantt__header-label"}>
                    Range in {label.unit}
                </Text>
            </div>
        </div>
        {ticks.map(({time, left}) => {
            return (
                <div
                    key={`header-${time}`}
                    className={"gantt__header-column"}
                    style={{
                        left,
                        width: stepWidth
                    }}
                >
                    <Text>
                        {formatTick(time)}
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

// Raw time units per display unit - the inverse of the divisors above.
const unitFactor = (unit: string): number => unit === "s" ? 1_000_000 : unit === "ms" ? 1_000 : 1