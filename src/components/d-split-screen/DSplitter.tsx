"use client"

import React from "react";
import {DSplitPaneHandle, DSplitPaneStatus} from "./DSplitPane";

import "./DSplitter.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";
import {getOverlapSize} from "overlap-area";

export interface DSplitterProps {
    firstPane?: React.RefObject<DSplitPaneHandle & HTMLDivElement>
    secondPane?: React.RefObject<DSplitPaneHandle & HTMLDivElement>
    direction?: DSplitScreenDirection
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
        const shiftPercentageD = Array.from(allScopeSplitters).filter((splitter: HTMLDivElement) => splitter != element).map((splitter: HTMLDivElement) => {
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

const DSplitter: React.FC<DSplitterProps> = (props) => {

    const {firstPane, secondPane, direction} = props
    const ref = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {

        if (!firstPane?.current || !secondPane?.current || !ref.current) return

        const disableSelect = (event: MouseEvent) => event.preventDefault();

        const onResizeAreaHover = (event: MouseEvent | TouchEvent) => {
            const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            if (!ref.current) return

            const resizeArea = getResizeArea(direction as DSplitScreenDirection, ref.current)
            if (resizeArea && isMouseInArea(resizeArea, mousePositionX, mousePositionY)) {
                ref.current!!.dataset.resize = 'true'
            } else {
                delete ref.current!!.dataset.resize
            }

        }

        const onCursorMove = (event: MouseEvent | TouchEvent, bBFirst: DOMRect, bBSecond: DOMRect) => {

            if (!firstPane?.current || !secondPane?.current || !ref.current) return

            const stackedSize = direction === "horizontal" ? bBSecond.right - bBFirst.left : bBSecond.bottom - bBFirst.top
            const bBContainer = (ref.current as HTMLDivElement).parentElement.getBoundingClientRect()

            const mPY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
            const mPX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

            const containerMPY = Math.min(Math.max((mPY) - bBFirst.y, 0), (bBSecond.bottom - bBFirst.y))
            const containerMPX = Math.min(Math.max((mPX) - bBFirst.x, 0), (bBSecond.right - bBFirst.x))

            const framedMPY = Math.min(Math.max(bBFirst.top + 1, mPY), bBSecond.bottom - 1)
            const framedMPX = Math.min(Math.max(bBFirst.left + 1, mPX), bBSecond.right - 1)

            const sizeFirstPane = firstPane?.current?.calculateSize(direction == "horizontal" ? containerMPX : containerMPY, "first", stackedSize) ?? 0
            const sizeSecondPane = secondPane?.current?.calculateSize(direction == "horizontal" ? containerMPX : containerMPY, "second", stackedSize) ?? 0

            if (sizeFirstPane[1] === DSplitPaneStatus.LIMIT || sizeSecondPane[1] === DSplitPaneStatus.LIMIT) return

            if (direction === "horizontal") (ref.current as HTMLDivElement).style.left = `${(framedMPX / bBContainer.width) * 100}%`
            else (ref.current as HTMLDivElement).style.top = `${(framedMPY / bBContainer.height) * 100}%`

            firstPane?.current?.setSize(sizeFirstPane[0], direction === "horizontal" ? bBFirst.x : bBFirst.y)
            secondPane?.current?.setSize(sizeSecondPane[0], direction === "horizontal" ? framedMPX : framedMPY)

        }

        const onCursorDown = (event: MouseEvent | TouchEvent) => {
            const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            //check if mouse is in resize area
            const resizeArea = getResizeArea(direction as DSplitScreenDirection, ref.current)
            if (resizeArea && !isMouseInArea(resizeArea, mousePositionX, mousePositionY)) return

            //deselect text
            const selection = document.getSelection()
            if (selection) selection.removeAllRanges()

            const bBFirst = firstPane.current.pane.getBoundingClientRect()
            const bBSecond = secondPane.current.pane.getBoundingClientRect()

            const moveEvent = (event: MouseEvent | TouchEvent) => onCursorMove(event, bBFirst, bBSecond)

            const onCursorUp = (event: MouseEvent | TouchEvent) => {
                //TODO
                //disable child splitters if they are in contact with current
                //level splitters

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
        //styling for resize areas

        if (firstPane && firstPane.current && ref.current) {
            setTimeout(() => {
                const bBFirst = firstPane.current!!.pane!!.getBoundingClientRect()
                const bBContainer = (ref.current as HTMLDivElement).parentElement.getBoundingClientRect()
                if (direction === "horizontal") {
                    (ref.current as HTMLDivElement).style.left = `${((bBFirst.left + bBFirst.width) / bBContainer.width) * 100}%`
                } else {
                    (ref.current as HTMLDivElement).style.top = `${((bBFirst.top + bBFirst.height) / bBContainer.height) * 100}%`
                }
            }, 0)

        }

        return () => {
            window.removeEventListener("touchstart", onCursorDown)
            window.removeEventListener("mousedown", onCursorDown)
            window.removeEventListener("mousemove", onResizeAreaHover)
            window.removeEventListener("touchmove", onResizeAreaHover)
        }


    }, [firstPane, secondPane, ref]);

    return <div ref={ref} className={`d-splitter d-splitter--${direction}`}/>
}

export default DSplitter