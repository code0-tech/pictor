import React, {CSSProperties} from "react"
import {hashToColor, withAlpha} from "../../utils"
import {GanttProps} from "./Gantt"
import {GanttItem} from "./GanttItem"
import {GanttHeader} from "./GanttHeader"

// The maximum empty gap between two items, expressed in columns. Larger gaps are
// compressed to this size so the timeline "jumps" instead of leaving huge voids.
const MAX_GAP_COLUMNS = 3

interface TimeScale {
    // Map an actual time value to its compressed ("effective") time.
    effTime: (t: number) => number
    // Inverse: map a compressed time back to the actual time (used for labels).
    invEffTime: (e: number) => number
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

    // Horizontal scroll state of the surrounding ScrollArea viewport, used to
    // drive the "you can scroll" indicators that stick to the visible edges.
    // `scrollWidth` is the viewport's full scrollable width (which can exceed
    // this group's own width when a wider nested group is expanded).
    const [scrollState, setScrollState] = React.useState({scrollLeft: 0, clientWidth: 0, scrollWidth: 0})

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

    const {effTime, invEffTime}: TimeScale = React.useMemo(() => {
        const maxGap = MAX_GAP_COLUMNS * step

        // Occupied time intervals, sorted and merged.
        const merged: [number, number][] = []
        const sorted = (items ?? []).map(i => [i.start, i.end] as [number, number]).sort((a, b) => a[0] - b[0])
        for (const [s, e] of sorted) {
            const last = merged[merged.length - 1]
            if (last && s <= last[1]) last[1] = Math.max(last[1], e)
            else merged.push([s, e])
        }

        // Collect the gaps that exceed the allowed width.
        const gaps: { gapStart: number, gapEnd: number, remove: number, removedBefore: number }[] = []
        let removed = 0
        for (let i = 1; i < merged.length; i++) {
            const gapStart = merged[i - 1][1]
            const gapEnd = merged[i][0]
            const len = gapEnd - gapStart
            if (len > maxGap) {
                gaps.push({gapStart, gapEnd, remove: len - maxGap, removedBefore: removed})
                removed += len - maxGap
            }
        }

        const effTime = (t: number) => {
            let e = t
            for (const g of gaps) {
                if (t >= g.gapEnd) e -= g.remove
                else if (t > g.gapStart + maxGap) e -= t - (g.gapStart + maxGap)
            }
            return e
        }

        const invEffTime = (eff: number) => {
            let t = eff
            for (const g of gaps) {
                const effGapStart = g.gapStart - g.removedBefore
                if (eff >= effGapStart + maxGap) t += g.remove
            }
            return t
        }

        return {effTime, invEffTime}
    }, [items, step])

    // Position of an item on the compressed timeline (in pixels).
    const positionFor = (startT: number, endT: number) => {
        const effStart = Math.max(start, effTime(startT))
        const effEnd = effTime(endT)
        const left = ((effStart - start) / step) * stepWidthPx
        const width = ((effEnd - effStart) / step) * stepWidthPx
        return {left, width}
    }

    // Column rendering calculations
    const columnsNeeded = items && items.length > 0 ? Math.ceil((effTime(itemMaxEnd) - start) / step) : timelineColumns
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

    // Track the horizontal scroll position / size of the enclosing ScrollArea
    // viewport so the scroll indicators know whether more content is available.
    React.useEffect(() => {
        const container = viewportRef.current
        if (!container) return
        const scroller = container.closest("[data-radix-scroll-area-viewport]") as HTMLElement | null
        if (!scroller) return

        const update = () => setScrollState({
            scrollLeft: scroller.scrollLeft,
            clientWidth: scroller.clientWidth,
            scrollWidth: scroller.scrollWidth,
        })

        update()
        scroller.addEventListener("scroll", update, {passive: true})
        window.addEventListener("resize", update)
        const resizeObserver = new ResizeObserver(update)
        resizeObserver.observe(scroller)
        resizeObserver.observe(container)
        return () => {
            scroller.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
            resizeObserver.disconnect()
        }
    }, [])

    // A 1px threshold avoids the indicator flickering on sub-pixel scroll ends.
    const canScrollLeft = scrollState.scrollLeft > 1
    const canScrollRight = scrollState.scrollLeft + scrollState.clientWidth < scrollState.scrollWidth - 1

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
        position: "relative",
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
                                          stepWidth={stepWidth}
                                          timeAtColumn={(columnIndex) => invEffTime(start + columnIndex * step)}
                                          canScrollLeft={canScrollLeft}
                                          canScrollRight={canScrollRight}/>}
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
                                        left: `${positionFor(itemMinStart, itemMinStart + step).left}px`,
                                        width: `${positionFor(itemMinStart, itemMinStart + step).width}px`,
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
                                        left: `${positionFor(itemMaxEnd - step, itemMaxEnd).left}px`,
                                        width: `${positionFor(itemMaxEnd - step, itemMaxEnd).width}px`,
                                    }}
                                />
                            </>
                        )}

                        {row.map((item, itemIndex) => {
                            const itemPosition = positionFor(item.start, item.end)
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
                                                                                               stepWidth={stepWidth}
                                                                                               rowHeight={rowHeight}
                                                                                               items={item.data.items}
                                                                                               key={`group-target-${itemIndex}`}/>
                    })}
                </React.Fragment>
            ))}

        </div>
    )
}