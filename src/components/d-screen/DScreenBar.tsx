"use client"

import {Code0Component} from "../../utils/types";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {getOverlapSize} from "overlap-area";
import {mergeCode0Props} from "../../utils/utils";
import {IconLayoutBottombarExpand} from "@tabler/icons-react";

export interface DScreenBarProps extends Omit<Code0Component<HTMLDivElement>, "children"> {
    children: React.ReactNode[] | React.ReactNode | ((collapsed: boolean, collapse: () => void) => React.ReactNode[] | React.ReactNode)
    type: 'top' | 'bottom' | 'left' | 'right'
    //defaults to false
    collapsed?: boolean
    resizeable?: boolean
    //defaults to 20px
    resizeAreaDimensions?: number
}

const getElementArea = (element: Element | null | undefined) => {
    const height = element?.clientHeight ?? 0
    const width = element?.clientWidth ?? 0

    const leftX = element?.getBoundingClientRect().left ?? 0
    const rightX = leftX + width
    const topY = element?.getBoundingClientRect().top ?? 0
    const bottomY = topY + height

    return {
        height,
        width,
        leftX,
        rightX,
        topY,
        bottomY
    }
}

const isMouseInArea = (coordinates: any, mouseX: number, mouseY: number) => {
    return mouseX >= coordinates.leftX
        && mouseX <= coordinates.rightX
        && mouseY >= coordinates.topY
        && mouseY <= coordinates.bottomY
}

const getShiftPercentage = (firstArea: any, secondArea: any): number | undefined => {

    const points1 = [
        [firstArea.leftX, firstArea.topY],
        [firstArea.leftX, firstArea.bottomY],
        [firstArea.rightX, firstArea.bottomY],
        [firstArea.rightX, firstArea.topY],
    ]

    const points2 = [
        [secondArea.leftX, secondArea.topY],
        [secondArea.leftX, secondArea.bottomY],
        [secondArea.rightX, secondArea.bottomY],
        [secondArea.rightX, secondArea.topY],
    ]

    const isLeft = firstArea.leftX <= secondArea.leftX
    const isTop = firstArea.topY <= secondArea.topY

    const overlapAreaInPxSquared = getOverlapSize(points1, points2)
    const resizeAreaPxSquared = (firstArea.rightX - firstArea.leftX) * (firstArea.bottomY - firstArea.topY)
    const shiftPercentage = Math.min(overlapAreaInPxSquared / resizeAreaPxSquared, 1)

    const negativePositiveNumber = isLeft && isTop ? shiftPercentage : -(shiftPercentage)

    return shiftPercentage == 0 ? undefined : negativePositiveNumber
}


const getResizeArea = (element: Element | undefined | null, shiftPercentage: number | undefined, resizeAreaDimensions: number = 25, areaPosition: number | undefined = undefined) => {

    const type = element?.getAttribute("data-bar-position") as 'top' | 'bottom' | 'left' | 'right'
    const oppositeType = type === "left" ? "right" : type === "right" ? "left" : type === "top" ? "bottom" : "top"

    const elementParent = element?.parentElement
    const elementCoordinates = getElementArea(element)
    const defaultResizeArea: any = shiftPercentage == undefined ? getResizeArea(element, 0) : {}

    if (shiftPercentage == undefined) {
        const elementsScope = elementParent?.querySelector(`:scope > [data-bar-position=${oppositeType}]`)
        const resizeArea = getResizeArea(elementsScope, 0)
        shiftPercentage = getShiftPercentage(defaultResizeArea, resizeArea)
    }

    if (shiftPercentage == undefined) {
        shiftPercentage = Array.from(document.querySelectorAll(`[data-bar-axis=${element?.getAttribute("data-bar-axis")}]`)).filter(elementParent => elementParent != element).map(elementParent => {
            const resizeArea: any = getResizeArea(elementParent, 0)
            return getShiftPercentage(defaultResizeArea, resizeArea)
        }).filter(elementParent => !!elementParent)[0]
    }

    if (shiftPercentage == undefined) shiftPercentage = 0


    if (type === 'top') return {
        leftX: elementCoordinates.leftX,
        rightX: elementCoordinates.rightX,
        topY: (areaPosition ?? elementCoordinates.bottomY) - (resizeAreaDimensions + (shiftPercentage * resizeAreaDimensions)),
        bottomY: (areaPosition ?? elementCoordinates.bottomY) + (resizeAreaDimensions - (shiftPercentage * resizeAreaDimensions))
    }

    if (type === 'bottom') return {
        leftX: elementCoordinates.leftX,
        rightX: elementCoordinates.rightX,
        topY: (areaPosition ?? elementCoordinates.topY) - (resizeAreaDimensions + (shiftPercentage * resizeAreaDimensions)),
        bottomY: (areaPosition ?? elementCoordinates.topY) + (resizeAreaDimensions - (shiftPercentage * resizeAreaDimensions))
    }

    if (type === 'left') return {
        leftX: (areaPosition ?? elementCoordinates.rightX) - (resizeAreaDimensions + (shiftPercentage * resizeAreaDimensions)),
        rightX: (areaPosition ?? elementCoordinates.rightX) + (resizeAreaDimensions - (shiftPercentage * resizeAreaDimensions)),
        topY: elementCoordinates.topY,
        bottomY: elementCoordinates.bottomY
    }

    if (type === 'right') return {
        leftX: (areaPosition ?? elementCoordinates.leftX) - (resizeAreaDimensions + (shiftPercentage * resizeAreaDimensions)),
        rightX: (areaPosition ?? elementCoordinates.leftX) + (resizeAreaDimensions - (shiftPercentage * resizeAreaDimensions)),
        topY: elementCoordinates.topY,
        bottomY: elementCoordinates.bottomY
    }

    return {
        leftX: -1,
        rightX: -1,
        topY: -1,
        bottomY: -1
    }

}

const isInResizeArea = (bar: HTMLElement | null | undefined, event: MouseEvent | TouchEvent) => {
    let inResizeArea = false

    const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
    const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

    const barType = bar?.dataset['bar-position']
    const oppositeType = barType === "left" ? "right" : barType === "right" ? "left" : barType === "top" ? "bottom" : "top"

    const barResizeCoordinates = getElementArea(bar?.querySelector('[data-resize-label]'))
    const mouseOverResize = isMouseInArea(barResizeCoordinates, mousePositionX, mousePositionY)

    const barParent = bar?.parentElement
    const oppositeBar = barParent?.querySelector(`.d-screen__${barType}-bar--${oppositeType}`)
    const oppositeBarResizeCoordinates = getElementArea(oppositeBar?.querySelector("[data-resize-label]"))

    inResizeArea = !bar?.ariaDisabled && (isMouseInArea(getResizeArea(bar, undefined), mousePositionX, mousePositionY))
        && (!isMouseInArea(oppositeBarResizeCoordinates, mousePositionX, mousePositionY)) || mouseOverResize


    if (inResizeArea && bar) bar!!.dataset.resize = 'true'
    else if (!inResizeArea && bar) delete bar!!.dataset.resize
    const barActiveBars = barParent?.querySelectorAll("[data-resize]") ?? []

    return inResizeArea && (barActiveBars.length < 2)
}

const Bar: React.FC<DScreenBarProps> = (props) => {
    const {
        type = 'top',
        children,
        collapsed = false,
        resizeable = false,
        resizeAreaDimensions = 20,
        ...rest
    } = props
    const barType = type === "left" || type === "right" ? "h" : "v"
    const oppositeType = type === "left" ? "right" : type === "right" ? "left" : type === "top" ? "bottom" : "top"
    const barRef = useRef<HTMLDivElement | null>(null)
    const barResizeRef = useRef<HTMLDivElement | null>(null)
    const [stateCollapsed, setStateCollapsed] = useState(collapsed)
    const [sizePercent, setSizePercent] = useState<{
        left: number | undefined,
        right: number | undefined,
        top: number | undefined,
        bottom: number | undefined
    }>({left: undefined, right: undefined, top: undefined, bottom: undefined})
    const showResizeLabel = useMemo(() => {
        const barSizePercent = sizePercent[type as "top" | "bottom" | "left" | "right"]
        const oppositeBarSizePercent = sizePercent[oppositeType] ?? 0

        if (!resizeable) return false
        if (barSizePercent === undefined) return false
        if (barSizePercent > 1) return false
        return oppositeBarSizePercent + barSizePercent <= 99;
    }, [sizePercent])
    const showOppositeResizeLabel = useMemo(() => {
        const barSizePercent = sizePercent[type as "top" | "bottom" | "left" | "right"] ?? 0
        const oppositeBarSizePercent = sizePercent[oppositeType] ?? 0

        if (!resizeable) return false
        if (barSizePercent === undefined) return false
        if (barSizePercent < 99) return false
        return barSizePercent + oppositeBarSizePercent >= 99;

    }, [barRef, sizePercent])


    resizeable && useEffect(() => {

        const startW = barRef.current?.offsetWidth ?? 0
        const startH = barRef.current?.offsetHeight ?? 0
        const minW = barRef.current?.style.minWidth ? parseFloat(barRef.current!!.style.minWidth) : 0
        const maxW = barRef.current?.style.maxWidth ? parseFloat(barRef.current!!.style.maxWidth) : Infinity
        const minH = barRef.current?.style.minHeight ? parseFloat(barRef.current!!.style.minHeight) : 0
        const maxH = barRef.current?.style.maxHeight ? parseFloat(barRef.current!!.style.maxHeight) : Infinity

        const setResizeStyle = (isInResizeArea: boolean) => {
            const border = `border${[...oppositeType][0].toUpperCase() + [...oppositeType].slice(1).join('')}Color` as "borderTopColor" | "borderLeftColor" | "borderBottomColor" | "borderRightColor"

            if (isInResizeArea && barRef.current) {
                barRef.current!!.style[border] = "#70ffb2"
            } else if (!isInResizeArea && barRef.current) {
                barRef.current!!.style[border] = ""
            }

            const resize = document.querySelector("[data-resize]")
            if (resize) document.body.style.cursor = resize.getAttribute("data-bar-axis") == "horizontal" ? "col-resize" : "row-resize"
            else document.body.style.cursor = ""
        }

        const onResize = (event: MouseEvent | TouchEvent) => {

            const barParent = barRef.current?.parentElement
            const mousePositionX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
            const mousePositionY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
            let localSizePercent = Infinity

            setStateCollapsed(false)

            if (barType === "h" && type === "left") {
                const spacing = barRef.current?.getBoundingClientRect().left ?? 0
                const widthPixel = Math.max(Math.min((mousePositionX - spacing), maxW), minW)
                const widthPixelAttaching = widthPixel <= (startW + 25) && widthPixel >= (startW - 25) ? startW : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / (barParent?.offsetWidth ?? 0)) * 100), 100), 0)
            } else if (barType === "h" && type === "right") {
                const spacing = (barRef.current?.getBoundingClientRect().right ?? 0) - (barParent?.offsetWidth ?? 0)
                const mousePosition = (barParent?.offsetWidth ?? 0) - mousePositionX
                const widthPixel = Math.max(Math.min((spacing + mousePosition), maxW), minW)
                const widthPixelAttaching = widthPixel <= (startW + 25) && widthPixel >= (startW - 25) ? startW : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / ((barParent?.offsetWidth ?? 0))) * 100), 100), 0)
            } else if (barType === "v" && type === "top") {
                const spacing = barRef.current?.getBoundingClientRect().top ?? 0
                const widthPixel = Math.max(Math.min((mousePositionY - spacing), maxH), minH)
                const widthPixelAttaching = widthPixel <= (startH + 25) && widthPixel >= (startH - 25) ? startH : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / (barParent?.offsetHeight ?? 0)) * 100), 100), 0)
            } else if (barType === "v" && type === "bottom") {
                const spacing = (barRef.current?.getBoundingClientRect().bottom ?? 0) - (barParent?.offsetHeight ?? 0)
                const mousePosition = (barParent?.offsetHeight ?? 0) - mousePositionY
                const widthPixel = Math.max(Math.min((spacing + mousePosition), maxH), minH)
                const widthPixelAttaching = widthPixel <= (startH + 25) && widthPixel >= (startH - 25) ? startH : widthPixel
                localSizePercent = Math.max(Math.min((((widthPixelAttaching) / ((barParent?.offsetHeight ?? 0))) * 100), 100), 0)
            }

            const oppositeBar = barParent?.querySelector(`.d-screen__${barType}-bar--${oppositeType}`)
            const oppositeBarResizeArea = getResizeArea(oppositeBar, 0)
            const barResizeArea = getResizeArea(barRef.current, 0, 25, barType === "h" ? mousePositionX : mousePositionY)

            if (type === "left" && barResizeArea.rightX > oppositeBarResizeArea.leftX) return
            if (type === "right" && barResizeArea.leftX < oppositeBarResizeArea.rightX) return
            if (type === "top" && barResizeArea.bottomY > oppositeBarResizeArea.topY) return
            if (type === "bottom" && barResizeArea.topY < oppositeBarResizeArea.bottomY) return

            //set new width
            if (barType === "h" && barRef.current) {
                barRef.current!!.style.minWidth = `${localSizePercent}%`
                barRef.current!!.style.maxWidth = `${localSizePercent}%`
                barRef.current!!.style.width = `${localSizePercent}%`
            } else if (barType === "v" && barRef.current) {
                barRef.current!!.style.minHeight = `${localSizePercent}%`
                barRef.current!!.style.height = `${localSizePercent}%`
            }

        }

        const onCursorMove = (event: MouseEvent | TouchEvent) => {
            const barParent = barRef.current?.parentElement
            const inResizeArea = isInResizeArea(barRef.current, event)
            setResizeStyle(inResizeArea)

            const allBars = barParent?.querySelectorAll(":scope > [data-bar-axis]") ?? []
            const allBarsSize = Array.from(allBars).map(bar => {
                return {[bar.getAttribute("data-bar-position") ?? ""]: bar.getAttribute("data-bar-axis")?.startsWith("h") ? (bar.clientWidth / (barParent?.clientWidth ?? 0)) * 100 : (bar.clientHeight / (barParent?.clientHeight ?? 0)) * 100}
            }).reduce((a, v) => ({...a, ...v})) as { left: number, right: number, top: number, bottom: number }
            setSizePercent(allBarsSize)
        }

        const onCursorDown = (event: MouseEvent | TouchEvent) => {

            //check if mouse is over bars resize Area
            const inResizeArea = isInResizeArea(barRef.current, event)
            if (!inResizeArea) return

            //disable all text selections for a better resizing experience
            const selection = document.getSelection()
            const disableSelect = (event: MouseEvent) => event.preventDefault();
            if (selection) selection.removeAllRanges()

            const onCursorUp = (event: MouseEvent | TouchEvent) => {

                //get content of parent
                const content = barRef.current?.parentElement?.querySelector(":scope > [data-content]")
                const childBars = content?.querySelectorAll("[data-bar-axis]") ?? []
                const scopeBars = barRef.current?.parentElement?.querySelectorAll(":scope > [data-bar-axis]") ?? []

                scopeBars.forEach((scopeBar: Element) => {

                    const barResizeArea = getResizeArea(scopeBar, undefined)

                    childBars.forEach((bar: Element) => {

                        const childResizeArea = getResizeArea(bar, undefined)
                        const overlappingPercentage = getShiftPercentage(barResizeArea, childResizeArea)


                        if (overlappingPercentage && (overlappingPercentage <= -0.4 || overlappingPercentage >= 0.4)) {
                            bar.ariaDisabled = "true"
                        } else {
                            bar.ariaDisabled = null
                        }
                    })
                })

                window.removeEventListener("touchcancel", onCursorUp)
                window.removeEventListener("touchend", onCursorUp)
                window.removeEventListener("mouseup", onCursorUp)

                window.removeEventListener("selectstart", disableSelect)

                window.removeEventListener("mousemove", onResize)
                window.removeEventListener("touchmove", onResize)
                window.addEventListener("mousemove", onCursorMove)
            }

            window.addEventListener("touchcancel", onCursorUp)
            window.addEventListener("touchend", onCursorUp)
            window.addEventListener("mouseup", onCursorUp)

            window.addEventListener('selectstart', disableSelect);

            window.addEventListener("mousemove", onResize)
            window.addEventListener("touchmove", onResize)

            window.removeEventListener("mousemove", onCursorMove)
        }

        window.addEventListener("touchstart", onCursorDown)
        window.addEventListener("mousedown", onCursorDown)
        window.addEventListener("mousemove", onCursorMove)

        return () => {
            window.removeEventListener("touchstart", onCursorDown)
            window.removeEventListener("mousedown", onCursorDown)
            window.removeEventListener("mousemove", onCursorMove)
        }

    }, [barRef, barResizeRef]);

    const collapse = () => {
        setStateCollapsed(prevState => {
            if (!prevState && resizeable && barRef.current && barType === "h") {
                barRef.current!!.style.minWidth = ""
                barRef.current!!.style.width = ""
            } else if (!prevState && resizeable && barRef.current && barType === "v") {
                barRef.current!!.style.minHeight = ""
                barRef.current!!.style.height = ""
            }
            return !prevState
        })

    }

    const child = typeof children === "function" ? useMemo(() => children(stateCollapsed, collapse), [stateCollapsed]) : children

    return <div
        ref={barRef}
        data-bar-position={type}
        data-bar-axis={barType === "h" ? "horizontal" : "vertical"}
        {...mergeCode0Props(`d-screen__${barType}-bar d-screen__${barType}-bar--${type}`, rest)}
    >
        {showResizeLabel && <div
            data-resize-label={"true"}
            ref={barResizeRef}
            className={`d-screen__${barType}-bar__resizable-label d-screen__${barType}-bar__resizable-label--${oppositeType}`}
        >
            <IconLayoutBottombarExpand/>
        </div>}


        {showOppositeResizeLabel && <div
            data-resize-label={"true"}
            ref={barResizeRef}
            className={`d-screen__${barType}-bar__resizable-label d-screen__${barType}-bar__resizable-label--${type}`}
        >
            <IconLayoutBottombarExpand/>
        </div>}

        <div {...mergeCode0Props(`d-screen__bar-content`, rest)}>
            {child}
        </div>
    </div>
}

export default Bar as React.FC<DScreenBarProps>