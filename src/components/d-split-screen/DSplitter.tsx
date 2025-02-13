import React, {useEffect} from "react";
import {DSplitPaneHandle} from "./DSplitPane";

import "./DSplitter.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";

export interface DSplitterProps {
    firstPane?: React.RefObject<DSplitPaneHandle & HTMLDivElement>
    secondPane?: React.RefObject<DSplitPaneHandle & HTMLDivElement>
    direction?: DSplitScreenDirection
}

const DSplitter: React.FC<DSplitterProps> = (props) => {

    const {firstPane, secondPane, direction} = props

    const ref = React.useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        const disableSelect = (event: MouseEvent) => event.preventDefault();

        const onCursorMove = (event: MouseEvent | TouchEvent) => {
            //TODO
            //calculate and set new size
        }

        const onCursorUp = (event: MouseEvent | TouchEvent) => {
            //TODO
            //disable child splitters if they are in contact with current
            //level splitters
        }

        const onCursorDown = (event: MouseEvent | TouchEvent) => {
            //TODO

            //check if mouse is in resize area

            //deselect text
            const selection = document.getSelection()
            if (selection) selection.removeAllRanges()

            window.addEventListener("touchcancel", onCursorUp)
            window.addEventListener("touchend", onCursorUp)
            window.addEventListener("mouseup", onCursorUp)

            window.addEventListener('selectstart', disableSelect);

            window.addEventListener("touchmove", onCursorMove)
            window.removeEventListener("mousemove", onCursorMove)
        }

        window.addEventListener("touchstart", onCursorDown)
        window.addEventListener("mousedown", onCursorDown)
        //styling for resize areas

        return () => {
            window.removeEventListener("touchstart", onCursorDown)
            window.removeEventListener("mousedown", onCursorDown)
            //styling for resize areas
        }


    }, [firstPane, secondPane, ref]);

    return <div ref={ref} className={`d-splitter d-splitter--${direction}`}/>
}

export default DSplitter