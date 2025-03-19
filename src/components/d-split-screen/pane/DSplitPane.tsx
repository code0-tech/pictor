import {Code0Component} from "../../../utils/types";
import React from "react";

import "./DSplitPane.style.scss"
import {mergeCode0Props} from "../../../utils/utils";

export interface DSplitPaneProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode,
    snap?: boolean
}



const DSplitPane: React.ForwardRefExoticComponent<DSplitPaneProps> = React.forwardRef((props, ref) => {

    const {children} = props

    /**
     useEffect(() => {
     if (!paneRef.current) return

     setTimeout(() => {
     const parentContainer = paneRef.current?.parentElement
     const bBContainer = parentContainer?.getBoundingClientRect()

     //switch size to percentage
     const size = paneRef.current?.getBoundingClientRect()
     if (direction === "horizontal") (paneRef.current as HTMLDivElement).style.width = `${(size.width / bBContainer.width) * 100}%`
     else (paneRef.current as HTMLDivElement).style.height = `${(size.height / bBContainer.height) * 100}%`

     if (paneRef.current?.style.maxWidth == "fit-content") {
     paneRef.current.style.maxWidth = paneRef.current?.style.width
     }

     if (paneRef.current?.style.minWidth == "fit-content") {
     paneRef.current.style.minWidth = paneRef.current?.style.width
     }

     if (paneRef.current?.style.maxHeight == "fit-content") {
     paneRef.current.style.maxHeight = paneRef.current?.style.height
     }

     if (paneRef.current?.style.minHeight == "fit-content") {
     paneRef.current.style.minHeight = paneRef.current?.style.height
     }

     if (snap) paneRef.current!!.dataset.snap = `${direction === "horizontal" ? size.width : size.height}`

     if (!(paneRef.current as HTMLDivElement).previousElementSibling) return

     //set initial left as percentage
     const bBPreviousElement: DOMRect = paneRef.current?.previousElementSibling?.getBoundingClientRect()
     if (direction === "horizontal") (paneRef.current as HTMLDivElement).style.left = bBPreviousElement ?
     `${((bBPreviousElement.left + bBPreviousElement.width) / bBContainer.width) * 100}%` : `0%`
     else (paneRef.current as HTMLDivElement).style.top = bBPreviousElement ?
     `${((bBPreviousElement.top + bBPreviousElement.height) / bBContainer.height) * 100}%` : "0%"
     }, 0)

     }, [paneRef]);

     const calculateSize = (position: number, pane: 'first' | 'second' = 'first', stackedSize: number = 0): (number | DSplitPaneStatus)[] => {

     const localRef = paneRef.current as HTMLDivElement
     const parentContainer = localRef.parentElement
     const bBContainer = parentContainer.getBoundingClientRect()
     const sizeContainer = direction == "horizontal" ? bBContainer.width ?? 0 : bBContainer.height ?? 0
     const minSize = parseUnit(direction == "horizontal" ? getComputedStyle(localRef).minWidth : getComputedStyle(localRef).minHeight)
     const minSizeInPixel: number = !(minSize[1] as string).includes("px") ? sizeContainer * ((minSize[0] as number) / 100) : (minSize[0] as number)
     const maxSize = parseUnit(direction == "horizontal" ? getComputedStyle(localRef).maxWidth : getComputedStyle(localRef).maxHeight)
     const maxSizeInPixel: number = !(maxSize[1] as string).includes("px") ? sizeContainer * ((maxSize[0] as number) / 100) : (maxSize[0] as number)

     //calculate new size based upon the new position
     //Pane can be scaled up or scaled down
     const sizeInPixel = pane === "first" ? position : stackedSize - position
     const isInSnapZone = snap && (sizeInPixel >= (Number(localRef.dataset.snap) - 25) && sizeInPixel <= (Number(localRef.dataset.snap) + 25))

     //If snap is enabled and the new size is inside the snap position we snap
     //to the snap position, which is always the standard mount size

     if (isInSnapZone) return [Number(localRef.dataset.snap), DSplitPaneStatus.SNAP]
     if (sizeInPixel <= minSizeInPixel && (localRef.style.minWidth || localRef.style.minHeight)) return [minSizeInPixel, DSplitPaneStatus.LIMIT]
     if (sizeInPixel >= maxSizeInPixel && (localRef.style.maxWidth || localRef.style.maxHeight)) return [maxSizeInPixel, DSplitPaneStatus.LIMIT]
     return [sizeInPixel, DSplitPaneStatus.NORMAL]

     }

     const setSize = (size: number, position: number = 0) => {
     const localRef = document.getElementById(id) as HTMLDivElement
     const parentContainer = localRef.parentElement
     const bBContainer = parentContainer.getBoundingClientRect()
     const sizeContainer = direction == "horizontal" ? bBContainer?.width ?? 0 : bBContainer?.height ?? 0

     if (localRef && direction == "horizontal") {
     localRef.style.width = `${(size / sizeContainer) * 100}%`
     localRef.style.left = `${(position / sizeContainer) * 100}%`
     } else if (localRef && direction == "vertical") {
     localRef.style.height = `${(size / sizeContainer) * 100}%`
     localRef.style.top = `${(position / sizeContainer) * 100}%`
     }
     }

     useImperativeHandle(ref, () => ({
     pane: paneRef.current,
     setSize,
     calculateSize
     }), [paneRef]);

     */

    return <div {...mergeCode0Props(`d-split-pane`, props)} ref={ref}>
        {children}
    </div>
})

export default React.memo(DSplitPane)