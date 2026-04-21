import React, {CSSProperties} from "react"
import {hashToColor, withAlpha} from "../../utils"
import {GanttProps} from "./Gantt"
import {GanttFooter} from "./GanttFooter"
import {GanttItem} from "./GanttItem"
import {GanttHeader} from "./GanttHeader"

const getItemPosition = (itemStart: number, itemEnd: number, start: number, end: number, timeRange: number, totalTimelineWidth: number) => {
    const relativeStart = Math.max(0, itemStart - start)
    const relativeEnd = Math.min(timeRange, itemEnd - start)
    const left = (relativeStart / timeRange) * totalTimelineWidth
    const width = ((relativeEnd - relativeStart) / timeRange) * totalTimelineWidth
    return {left, width}
}

export interface GanttGroupProps extends GanttProps {
    start?: number
    end?: number
    hideScaling?: boolean
}

export const GanttGroup: React.FC<GanttGroupProps> = (props) => {

    const {
        items,
        stepWidth = "50px",
        rowHeight = "50px",
        step = 1,
        start = 1,
        end = 999_999_999,
        hideScaling = false,
        children
    } = props

    const viewportRef = React.useRef<HTMLDivElement>(null)
    const [viewportWidth, setViewportWidth] = React.useState(0)

    // Parse stepWidth to pixels
    const stepWidthPx = parseInt(stepWidth as string)

    // Timeline calculations
    const timeRange = end - start
    const timelineColumns = Math.ceil(timeRange / step)
    const totalTimelineWidth = timelineColumns * stepWidthPx

    // Item statistics
    const nonGroupItems = items?.filter((item: any) => item.type !== "group") ?? []
    const avgDuration = nonGroupItems.length === 0
        ? step
        : nonGroupItems.reduce((sum: number, item: any) => sum + (item.end - item.start), 0) / nonGroupItems.length
    const itemMinStart = items && items.length > 0 ? Math.min(...items.map(item => item.start)) : start
    const itemMaxEnd = items && items.length > 0 ? Math.max(...items.map(item => item.end)) : end

    // Column rendering calculations
    const columnsNeeded = items && items.length > 0 ? Math.ceil((itemMaxEnd - start) / step) : timelineColumns
    const columnsInViewport = Math.ceil(viewportWidth / stepWidthPx)
    const columnsToRender = Math.max(columnsInViewport, columnsNeeded + 2)

    React.useEffect(() => {
        const handleResize = () => {
            setViewportWidth(viewportRef.current?.offsetWidth ?? 0)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Calculate row assignments (non-overlapping rows)
    const itemRows = items?.length ? items
            .sort((a, b) => a.start - b.start)
            .reduce((rows: typeof items[], item) => {
                const existingRow = rows.find(row => !row.some(existingItem =>
                    !(item.end <= existingItem.start || item.start >= existingItem.end)
                ))
                return existingRow ? (existingRow.push(item), rows) : [...rows, [item]]
            }, [])
        : []

    // Style configurations
    const containerStyles: CSSProperties = {
        display: "grid",
        gridTemplateColumns: `repeat(${columnsToRender}, ${stepWidth})`,
        width: "100%",
        minHeight: "100%"
    }

    return (
        <div data-gantt-id={props.id} id={props.id} ref={viewportRef} style={containerStyles}>

            {!hideScaling && <GanttHeader columnCount={columnsToRender}
                                          start={start}
                                          step={step}
                                          avgDuration={avgDuration}
                                          stepWidth={stepWidth}/>}
            {itemRows.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} style={{
                    gridColumn: "1 / -1",
                    height: rowHeight,
                    position: "relative",
                    backgroundColor: "transparent"
                }}>
                    {Array.from({length: columnsToRender - 1}).map((_, columnIndex) => (
                        <div key={`grid-${columnIndex}`} style={{
                            position: "absolute",
                            left: (columnIndex + 1) * stepWidthPx,
                            top: 0,
                            bottom: 0,
                            width: "0px",
                            borderLeft: `1px dashed rgba(255, 255, 255, ${hideScaling ? 0.05 : 0.1})`
                        }}/>
                    ))}

                    {hideScaling && (
                        <>
                            <div
                                className="gantt__group-wrapper"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, transparent, #070514), 
                                        repeating-linear-gradient(
                                          45deg, 
                                          transparent, 
                                          transparent 2px, 
                                          ${withAlpha(hashToColor(props.id!.replace("target", "source")), 0.5)} 4px
                                        )
                                    `,
                                    left: `${getItemPosition(itemMinStart, itemMinStart + step, start, end, timeRange, totalTimelineWidth).left}px`,
                                    width: `${getItemPosition(itemMinStart, itemMinStart + step, start, end, timeRange, totalTimelineWidth).width}px`,
                                }}
                            />
                            <div
                                className="gantt__group-wrapper"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to left, transparent, #070514), 
                                        repeating-linear-gradient(
                                          45deg, 
                                          transparent, 
                                          transparent 2px, 
                                          ${withAlpha(hashToColor(props.id!.replace("target", "source")), 0.5)} 4px
                                        )
                                    `,
                                    left: `${getItemPosition(itemMaxEnd - step, itemMaxEnd, start, end, timeRange, totalTimelineWidth).left}px`,
                                    width: `${getItemPosition(itemMaxEnd - step, itemMaxEnd, start, end, timeRange, totalTimelineWidth).width}px`,
                                }}
                            />
                        </>
                    )}

                    {row.map((item, itemIndex) => {
                        const itemPosition = getItemPosition(item.start, item.end, start, end, timeRange, totalTimelineWidth)
                        const hasVisibleWidth = itemPosition.width > 0

                        return hasVisibleWidth && (
                            <GanttItem
                                key={item.id}
                                id={item.id}
                                w={`${itemPosition.width}px`}
                                left={`${itemPosition.left}px`}
                            >
                                {children?.(item, itemIndex)}
                            </GanttItem>
                        )
                    })}
                </div>
            ))}
            {!hideScaling && <GanttFooter/>}

        </div>
    )
}