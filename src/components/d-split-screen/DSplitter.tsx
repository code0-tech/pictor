import React, {useEffect} from "react";
import {DSplitPaneHandle, DSplitPaneStatus} from "./DSplitPane";

import "./DSplitter.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";

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

const getResizeArea = (
    direction: DSplitScreenDirection,
    element: HTMLElement | undefined | null,
    shiftPercentage: number | undefined = 0,
    resizeAreaDimensions: number = 25
): DOMRect | null => {

    const bBElement = element?.getBoundingClientRect()

    if (!bBElement) return null

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

    useEffect(() => {

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
            const bBContainer =( ref.current as HTMLDivElement).parentElement.getBoundingClientRect()

            const mPY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
            const mPX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

            const framedMPY = Math.min(Math.max((mPY) - bBFirst.y, 0), stackedSize)
            const framedMPX = Math.min(Math.max((mPX) - bBFirst.x, 0), stackedSize)

            const containerMPY = Math.min(Math.max((mPY) - bBContainer.y, 0), bBContainer.height)
            const containerMPX = Math.min(Math.max((mPX) - bBContainer.x, 0), bBContainer.width)

            const sizeFirstPane = firstPane?.current?.calculateSize(direction == "horizontal" ? framedMPX : framedMPY, "first", stackedSize) ?? 0
            const sizeSecondPane = secondPane?.current?.calculateSize(direction == "horizontal" ? framedMPX : framedMPY, "second", stackedSize) ?? 0

            if (sizeFirstPane[1] === DSplitPaneStatus.LIMIT || sizeSecondPane[1] === DSplitPaneStatus.LIMIT) {
                return
            }

            if (direction === "horizontal") (ref.current as HTMLDivElement).style.left = `${(containerMPX / bBContainer.width) * 100}%`
            else (ref.current as HTMLDivElement).style.top = `${(containerMPY / bBContainer.height) * 100}%`

            firstPane?.current?.setSize(sizeFirstPane[0], direction === "horizontal" ? bBFirst.x : bBFirst.y)
            secondPane?.current?.setSize(sizeSecondPane[0], direction === "horizontal" ? containerMPX : containerMPY)

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
            const bBFirst = firstPane.current.pane?.getBoundingClientRect()
            if (direction === "horizontal") (ref.current as HTMLDivElement).style.left = `${(bBFirst.left + bBFirst.width)}px`
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