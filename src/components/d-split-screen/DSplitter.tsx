"use client"

import React from "react";
import {DSplitScreenDirection} from "./DSplitScreen";
import {getOverlapSize} from "overlap-area";
import {DSplitView} from "./DSplitScreen.service";
import "./DSplitter.style.scss"

export interface DSplitterProps {
    splitView: DSplitView
    split: 'vertical' | 'horizontal'
    ref: React.RefCallback<HTMLDivElement>
}

const isMouseInArea = (coordinates: DOMRect, mouseX: number, mouseY: number) => {
    return mouseX >= coordinates.left
        && mouseX <= coordinates.right
        && mouseY >= coordinates.top
        && mouseY <= coordinates.bottom
}

const getShiftPercentage = (bBFirst: DOMRect, bBSecond: DOMRect): number | undefined => {

    const points1 = [
        [bBFirst.left, bBFirst.top],
        [bBFirst.left, bBFirst.bottom],
        [bBFirst.right, bBFirst.bottom],
        [bBFirst.right, bBFirst.top],
    ]

    const points2 = [
        [bBSecond.left, bBSecond.top],
        [bBSecond.left, bBSecond.bottom],
        [bBSecond.right, bBSecond.bottom],
        [bBSecond.right, bBSecond.top],
    ]

    const isLeft = bBFirst.x < bBSecond.x
    const isTop = bBFirst.y < bBSecond.y

    const overlapAreaInPxSquared = getOverlapSize(points1, points2)
    const resizeAreaPxSquared = (bBFirst.right - bBFirst.left) * (bBFirst.bottom - bBFirst.top)
    const shiftPercentage = Math.min(overlapAreaInPxSquared / resizeAreaPxSquared, 1)

    const negativePositiveNumber = isLeft || isTop ? shiftPercentage : -(shiftPercentage)

    return shiftPercentage == 0 ? undefined : negativePositiveNumber
}

const getResizeArea = (
    direction: DSplitScreenDirection,
    element: HTMLElement | undefined | null,
    shiftPercentage: number | undefined = undefined,
    resizeAreaDimensions: number = 25
): DOMRect => {

    const bBElement = element!!.getBoundingClientRect()

    if (shiftPercentage === undefined) {
        const allScopeSplitters = element?.parentElement?.querySelectorAll('.d-splitter')
        const shiftPercentageD = Array.from(allScopeSplitters!!).filter((splitter: HTMLDivElement) => splitter != element).map((splitter: HTMLDivElement) => {
            return getShiftPercentage(getResizeArea(direction, element, 0), getResizeArea(direction, splitter, 0))
        }).filter(shift => shift)

        const minValue = shiftPercentageD.length > 0 ? Math.min(...(shiftPercentageD as number[])) : undefined
        const maxValue = shiftPercentageD.length > 0 ? Math.max(...(shiftPercentageD as number[])) : undefined


        if (minValue && maxValue && ((minValue < 0 && maxValue < 0) || (minValue > 0 && maxValue > 0))) {
            const value = minValue!! < 0 ? minValue : maxValue
            return direction == "horizontal" ? {
                left: bBElement.left - resizeAreaDimensions - (value * resizeAreaDimensions),
                right: bBElement.right + resizeAreaDimensions - (value * resizeAreaDimensions),
                top: bBElement.top,
                bottom: bBElement.bottom,
                x: bBElement.x - resizeAreaDimensions,
                y: bBElement.y,
                width: bBElement.width + (resizeAreaDimensions * 2),
                height: bBElement.height,
                toJSON: bBElement.toJSON
            } : {
                left: bBElement.left,
                right: bBElement.right,
                top: bBElement.top - resizeAreaDimensions - (value * resizeAreaDimensions),
                bottom: bBElement.bottom + resizeAreaDimensions - (value * resizeAreaDimensions),
                x: bBElement.x,
                y: bBElement.y - resizeAreaDimensions,
                width: bBElement.width,
                height: bBElement.height + (resizeAreaDimensions * 2),
                toJSON: bBElement.toJSON
            }
        } else if (minValue && maxValue) {
            return direction == "horizontal" ? {
                left: bBElement.left - resizeAreaDimensions - ((minValue < -0.8 ? 1 : minValue) * resizeAreaDimensions),
                right: bBElement.right + resizeAreaDimensions - ((maxValue > 0.8 ? 1 : maxValue) * resizeAreaDimensions),
                top: bBElement.top,
                bottom: bBElement.bottom,
                x: bBElement.x - resizeAreaDimensions,
                y: bBElement.y,
                width: bBElement.width + (resizeAreaDimensions * 2),
                height: bBElement.height,
                toJSON: bBElement.toJSON
            } : {
                left: bBElement.left,
                right: bBElement.right,
                top: bBElement.top - resizeAreaDimensions - ((minValue < -0.8 ? 1 : minValue) * resizeAreaDimensions),
                bottom: bBElement.bottom + resizeAreaDimensions - ((maxValue > 0.8 ? 1 : maxValue) * resizeAreaDimensions),
                x: bBElement.x,
                y: bBElement.y - resizeAreaDimensions,
                width: bBElement.width,
                height: bBElement.height + (resizeAreaDimensions * 2),
                toJSON: bBElement.toJSON
            }
        }
    }

    return direction == "horizontal" ? {
        left: bBElement.left - resizeAreaDimensions,
        right: bBElement.right + resizeAreaDimensions,
        top: bBElement.top,
        bottom: bBElement.bottom,
        x: bBElement.x - resizeAreaDimensions,
        y: bBElement.y,
        width: bBElement.width + (resizeAreaDimensions * 2),
        height: bBElement.height,
        toJSON: bBElement.toJSON
    } : {
        left: bBElement.left,
        right: bBElement.right,
        top: bBElement.top - resizeAreaDimensions,
        bottom: bBElement.bottom + resizeAreaDimensions,
        x: bBElement.x,
        y: bBElement.y - resizeAreaDimensions,
        width: bBElement.width,
        height: bBElement.height + (resizeAreaDimensions * 2),
        toJSON: bBElement.toJSON
    }

}

const DSplitter: React.ForwardRefExoticComponent<DSplitterProps> = React.forwardRef((props, ref: React.RefCallback<HTMLDivElement>) => {

    const {splitView, split} = props
    const splitterRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!splitterRef.current) return

        const disableSelect = (event: MouseEvent) => event.preventDefault();

        const onResizeAreaHover = (event: MouseEvent | TouchEvent) => {
            const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            if (!splitterRef.current) return

            const resizeArea = getResizeArea(split as DSplitScreenDirection, splitterRef.current)
            if (resizeArea && !splitterRef.current!!.ariaDisabled && isMouseInArea(resizeArea, mousePositionX, mousePositionY)) {
                splitView.onResizeAreaEnter(event)
            } else {
                splitView.onResizeAreaLeave(event)
            }

            const resize = document.querySelector("[data-resize]")
            if (resize) document.body.style.cursor = resize.getAttribute("data-direction") == "horizontal" ? "col-resize" : "row-resize"
            else document.body.style.cursor = ""

        }

        const onCursorDown = (event: MouseEvent | TouchEvent) => {
            const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            //check if mouse is in resize area
            const resizeArea = getResizeArea(split as DSplitScreenDirection, splitterRef.current)
            if (resizeArea && (splitterRef.current!!.ariaDisabled!! || !isMouseInArea(resizeArea, mousePositionX, mousePositionY))) return

            splitView.onDragStart(event)

            const moveEvent = (event: MouseEvent | TouchEvent) => splitView.onDrag(event)

            const onCursorUp = (event: MouseEvent | TouchEvent) => {

                splitView.onDragEnd(event)
                window.removeEventListener("touchcancel", onCursorUp)
                window.removeEventListener("touchend", onCursorUp)
                window.removeEventListener("mouseup", onCursorUp)

                window.removeEventListener("selectstart", disableSelect)

                window.removeEventListener("mousemove", moveEvent)
                window.removeEventListener("touchmove", moveEvent)
            }

            window.addEventListener("touchcancel", onCursorUp)
            window.addEventListener("touchend", onCursorUp)
            window.addEventListener("mouseup", onCursorUp)

            window.addEventListener('selectstart', disableSelect);

            window.addEventListener("touchmove", moveEvent)
            window.addEventListener("mousemove", moveEvent)
        }

        window.addEventListener("touchstart", onCursorDown)
        window.addEventListener("mousedown", onCursorDown)
        window.addEventListener("mousemove", onResizeAreaHover)
        window.addEventListener("touchmove", onResizeAreaHover)


        return () => {
            window.removeEventListener("touchstart", onCursorDown)
            window.removeEventListener("mousedown", onCursorDown)
            window.removeEventListener("mousemove", onResizeAreaHover)
            window.removeEventListener("touchmove", onResizeAreaHover)
        }


    }, [splitterRef, splitView]);

    return <div ref={(element) => {
        splitterRef.current = element
        ref(element)
    }} className={`d-splitter d-splitter--${split}`} data-direction={split}/>
})

export default DSplitter