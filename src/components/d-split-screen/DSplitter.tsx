import React, {useEffect} from "react";
import {DSplitPaneHandle} from "./DSplitPane";

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
): DOMRect => {

    const bBElement = element?.getBoundingClientRect()

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
            if (isMouseInArea(resizeArea, mousePositionX, mousePositionY)) {
                ref.current!!.dataset.resize = 'true'
            } else {
                delete ref.current!!.dataset.resize
            }

        }

        const onCursorMove = (event: MouseEvent | TouchEvent) => {
            const mPY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mPX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            const sizeFirstPane = firstPane?.current?.calculateSize(direction == "horizontal" ? mPX : mPY, "first") ?? 0
            const sizeSecondPane = secondPane?.current?.calculateSize(direction == "horizontal" ? mPX : mPY, "second") ?? 0

            /**
             const scopeSplitters: NodeListOf<HTMLDivElement> = ref.current?.parentElement?.querySelectorAll(":scope > .d-splitter")
             const isInContact = Array.from(scopeSplitters).filter(splitter => splitter != ref.current).map((splitter) => {
             const resizeArea = getResizeArea(direction as DSplitScreenDirection, splitter)
             return isMouseInArea(resizeArea, mPX, mPY)
             }).reduce((previousValue, currentValue) => previousValue && currentValue)

             if (isInContact) return
             **/

            if ((sizeFirstPane?.status == "SHRINK" && sizeSecondPane?.status == "EXPAND") ||
                (sizeSecondPane?.status == "SHRINK" && sizeFirstPane?.status == "EXPAND")) {
                firstPane?.current?.setSize(sizeFirstPane.size)
                secondPane?.current?.setSize(sizeSecondPane.size)
            }



        }

        const onCursorUp = (event: MouseEvent | TouchEvent) => {
            //TODO
            //disable child splitters if they are in contact with current
            //level splitters

            window.removeEventListener("touchcancel", onCursorUp)
            window.removeEventListener("touchend", onCursorUp)
            window.removeEventListener("mouseup", onCursorUp)

            window.removeEventListener("selectstart", disableSelect)

            window.removeEventListener("mousemove", onCursorMove)
            window.removeEventListener("touchmove", onCursorMove)
        }

        const onCursorDown = (event: MouseEvent | TouchEvent) => {
            const mousePositionY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY)
            const mousePositionX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX)

            //check if mouse is in resize area
            const resizeArea = getResizeArea(direction as DSplitScreenDirection, ref.current)
            if (!isMouseInArea(resizeArea, mousePositionX, mousePositionY)) return

            //deselect text
            const selection = document.getSelection()
            if (selection) selection.removeAllRanges()

            window.addEventListener("touchcancel", onCursorUp)
            window.addEventListener("touchend", onCursorUp)
            window.addEventListener("mouseup", onCursorUp)

            window.addEventListener('selectstart', disableSelect);

            window.addEventListener("touchmove", onCursorMove)
            window.addEventListener("mousemove", onCursorMove)
        }

        window.addEventListener("touchstart", onCursorDown)
        window.addEventListener("mousedown", onCursorDown)
        window.addEventListener("mousemove", onResizeAreaHover)
        window.addEventListener("touchmove", onResizeAreaHover)
        //styling for resize areas

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