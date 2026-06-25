import React, {CSSProperties} from "react"
import {hashToColor, withAlpha} from "../../utils"
import {GanttProps} from "./Gantt"
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
    const [activeGroup, setActiveGroup] = React.useState<string | undefined>(undefined)

    // Parse stepWidth to pixels
    const stepWidthPx = React.useMemo(() => parseInt(stepWidth as string), [stepWidth])

    // Timeline calculations
    const timeRange = end - start
    const timelineColumns = Math.ceil(timeRange / step)
    const totalTimelineWidth = timelineColumns * stepWidthPx

    // Item statistics
    const {avgDuration, itemMinStart, itemMaxEnd} = React.useMemo(() => {
        if (!items || items.length === 0) {
            return {avgDuration: step, itemMinStart: start, itemMaxEnd: end}
        }
        let sumDuration = 0
        let nonGroupCount = 0
        let minStart = Infinity
        let maxEnd = -Infinity
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.start < minStart) minStart = item.start
            if (item.end > maxEnd) maxEnd = item.end
            if ((item as any).type !== "group") {
                sumDuration += item.end - item.start
                nonGroupCount++
            }
        }
        return {
            avgDuration: nonGroupCount === 0 ? step : sumDuration / nonGroupCount,
            itemMinStart: minStart,
            itemMaxEnd: maxEnd,
        }
    }, [items, start, end, step])

    // Column rendering calculations
    const columnsNeeded = items && items.length > 0 ? Math.ceil((itemMaxEnd - start) / step) : timelineColumns
    const columnsInViewport = Math.ceil(viewportWidth / stepWidthPx)
    const columnsToRender = Math.max(columnsInViewport, columnsNeeded + 2)

    React.useEffect(() => {
        const handleResize = () => {
            setViewportWidth(viewportRef.current?.offsetWidth ?? 0)
        }

        handleResize()
        const viewport = viewportRef.current
        viewport?.addEventListener("resize", handleResize)
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
            viewport?.removeEventListener("resize", handleResize)
        }
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
    const containerStyles: CSSProperties = React.useMemo(() => ({
        display: "grid",
        gridTemplateColumns: `repeat(${columnsToRender}, ${stepWidth})`,
        minWidth: "100%",
        gridColumn: "1 / -1",
    }), [columnsToRender, stepWidth])

    const rowStyle: CSSProperties = React.useMemo(() => ({
        gridColumn: "1 / -1",
        minHeight: rowHeight,
        position: "relative",
        backgroundColor: "transparent"
    }), [rowHeight])

    const gridLineColumns = React.useMemo(
        () => Array.from({length: Math.max(0, columnsToRender - 1)}),
        [columnsToRender]
    )

    return (
        <div data-gantt-id={props.id} id={props.id} ref={viewportRef} style={containerStyles}>

            {!hideScaling && <GanttHeader columnCount={columnsToRender}
                                          start={start}
                                          step={step}
                                          avgDuration={avgDuration}
                                          stepWidth={stepWidth}/>}
            {itemRows.map((row, rowIndex) => (
                <React.Fragment key={`row-frag-${rowIndex}`}>
                    <div key={`row-${rowIndex}`} style={rowStyle}>
                        {gridLineColumns.map((_, columnIndex) => (
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
                                    onClick={() => {
                                        if (item.type != "group") return
                                        setActiveGroup(prevState => item.id === prevState ? undefined : item.id)
                                    }}
                                >
                                    {children?.(item, itemIndex)}
                                </GanttItem>
                            )
                        })}
                    </div>
                    {row.map((item, itemIndex) => {
                        return item.type === "group" && activeGroup === item.id && <GanttGroup children={children}
                                           id={`group-target-${itemIndex}`}
                                           start={(Math.min(...item.data.items.map((item: any) => item.start))) - ((((Math.min(...item.data.items.map((item: any) => item.start))) / (item.data.firstGroupStep * item.data.step)) * (item.data.groupStep * item.data.step)))}
                                           step={item.data.groupStep * item.data.step}
                                           stepWidth={stepWidth} rowHeight={rowHeight} items={item.data.items}
                                           key={`group-target-${itemIndex}`}/>
                    })}
                </React.Fragment>
            ))}

        </div>
    )
}