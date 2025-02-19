import {Code0Component} from "../../utils/types";
import React, {useImperativeHandle} from "react";

import "./DSplitPane.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";
import {mergeCode0Props, parseUnit} from "../../utils/utils";

export interface DSplitPaneProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode
    direction?: DSplitScreenDirection

    //defaults to true
    visible?: boolean
    //defaults to true
    snap?: boolean
}

export enum DSplitPaneStatus {
    NORMAL,
    LIMIT
}

export interface DSplitPaneHandle {
    setSize: (sizeInPercent: number) => void
    calculateSize: (position: number, pane: 'first' | 'second') => (number | DSplitPaneStatus)[]
    getDOM: () => HTMLElement
}


const DSplitPane: React.ForwardRefExoticComponent<React.PropsWithoutRef<DSplitPaneProps> & React.RefAttributes<DSplitPaneHandle>> =
    React.forwardRef<DSplitPaneHandle, DSplitPaneProps>((props, ref) => {

        const {children, snap = true, visible = true, direction = "horizontal"} = props
        const id = React.useId()

        const calculateSize = (position: number, pane: 'first' | 'second' = 'first', stackedSize: number = 0): (number | DSplitPaneStatus)[] => {

            const localRef = document.getElementById(id) as HTMLDivElement
            const parentContainer = localRef?.parentElement
            const bBContainer = parentContainer?.getBoundingClientRect()
            const sizeContainer = direction == "horizontal" ? bBContainer?.width ?? 0 : bBContainer?.height ?? 0
            const minSize = parseUnit(direction == "horizontal" ? getComputedStyle(localRef).minWidth : getComputedStyle(localRef).minHeight)
            const minSizeInPixel: number = !(minSize[1] as string).includes("px") ? sizeContainer * ((minSize[0] as number) / 100) : (minSize[0] as number)
            const maxSize = parseUnit(direction == "horizontal" ? getComputedStyle(localRef).maxWidth : getComputedStyle(localRef).maxHeight)
            const maxSizeInPixel: number = !(maxSize[1] as string).includes("px") ? sizeContainer * ((maxSize[0] as number) / 100) : (maxSize[0] as number)


            //calculate new size based upon the new position
            //Pane can be scaled up or scaled down
            const sizeInPixel = pane === "first" ? position : stackedSize - position

            //If snap is enabled and the new size is inside the snap position we snap
            //to the snap position, which is always the standard mount size

            if (sizeInPixel <= minSizeInPixel) {
                return [minSizeInPixel, DSplitPaneStatus.LIMIT]
            }

            if (sizeInPixel >= maxSizeInPixel) {
                return [maxSizeInPixel, DSplitPaneStatus.LIMIT]
            }

            return [sizeInPixel, DSplitPaneStatus.NORMAL]

        }

        const setSize = (size: number, position: number = 0) => {
            const localRef = document.getElementById(id) as HTMLDivElement
            const parentContainer = localRef?.parentElement
            const bBContainer = parentContainer?.getBoundingClientRect()
            const sizeContainer = direction == "horizontal" ? bBContainer?.width ?? 0 : bBContainer?.height ?? 0

            if (localRef && direction == "horizontal") {
                localRef.style.width = `${(size / sizeContainer) * 100}%`
                localRef.style.left = `${(position / sizeContainer) * 100}%`
            } else if (localRef && direction == "vertical") {
                localRef.style.height = `${(size / sizeContainer) * 100}%`
                localRef.style.top = `${(position / sizeContainer) * 100}%`
            }
        }

        const getDOM = () => {
            const localRef = document.getElementById(id) as HTMLDivElement
            return localRef
        }

        useImperativeHandle(ref, () => ({
            setSize,
            calculateSize,
            getDOM
        }), []);

        return <div id={id} {...mergeCode0Props("d-split-pane", props)} ref={instance => {

            if (!instance || !instance.previousElementSibling) return

            const previousWidth = instance.previousElementSibling.getBoundingClientRect()
            instance.style.left = `${previousWidth.left + previousWidth.width + 1}px`

        }}>
            {children}
        </div>
    })

export default React.memo(DSplitPane)