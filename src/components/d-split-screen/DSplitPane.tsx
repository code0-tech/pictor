import {Code0Component} from "../../utils/types";
import React, {useImperativeHandle} from "react";

import "./DSplitPane.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";
import {mergeCode0Props} from "../../utils/utils";

export interface DSplitPaneProps extends Code0Component<HTMLDivElement> {
    children: React.ReactNode
    direction: DSplitScreenDirection

    //defaults to true
    visible?: boolean
    //defaults to true
    snap?: boolean
}

export interface DSplitPaneHandle {
    setSize: (sizeInPercent: number) => void
    calculateSize: (position: number, pane: 'first' | 'second') => { status: 'SHRINK' | 'EXPAND' | undefined, size: number }
}

const DSplitPane: React.ForwardRefExoticComponent<React.PropsWithoutRef<DSplitPaneProps> & React.RefAttributes<DSplitPaneHandle>> =
    React.forwardRef<DSplitPaneHandle, DSplitPaneProps>((props, ref) => {

        const {children, snap = true, visible = true, direction} = props
        const id = React.useId()

        const calculateSize = (position: number, pane: 'first' | 'second' = 'first'): { status: 'SHRINK' | 'EXPAND' | undefined, size: number } => {

            const localRef = document.getElementById(id) as HTMLDivElement
            const parentContainer = localRef?.parentElement
            const bBPane = localRef?.getBoundingClientRect()
            const bBContainer = parentContainer?.getBoundingClientRect()
            const sizePane = direction == "horizontal" ? bBPane.width : bBPane.height
            const sizeContainer = direction == "horizontal" ? bBContainer.width : bBContainer.height
            const framedPosition = Math.max(Math.min(position, sizeContainer), bBContainer.x)
            let status: 'SHRINK' | 'EXPAND' | undefined = undefined
            let sizeInPercent = Infinity

            //the position is either the x or y coordinate of the splitter
            const firstBorder = direction == "horizontal" ? bBPane.left : bBPane.top
            const secondBorder = direction == "horizontal" ? bBPane.right : bBPane.bottom

            //calculate new size based upon the new position
            //Pane can be scaled up or scaled down

            if (framedPosition > firstBorder && framedPosition < secondBorder) {
                const shift = pane === "first" ? secondBorder - framedPosition : framedPosition - firstBorder
                const widthInPx = sizePane - shift
                status = "SHRINK"
                sizeInPercent = widthInPx / sizeContainer
            }

            if (framedPosition > firstBorder && framedPosition > secondBorder) {
                console.log("EXPAND 1")
                const shift = framedPosition - secondBorder
                const widthInPx = sizePane + shift
                status = "EXPAND"
                sizeInPercent = widthInPx / sizeContainer
            }

            if (framedPosition < firstBorder && framedPosition < secondBorder) {
                console.log("EXPAND 2")
                const shift = firstBorder - framedPosition
                const widthInPx = sizePane + shift
                status = "EXPAND"
                sizeInPercent = widthInPx / sizeContainer
            }

            //If snap is enabled and the new size is inside the snap position we snap
            //to the snap position, which is always the standard mount size

            return {
                status: status,
                size: sizeInPercent
            }

        }

        const setSize = (sizeInPercent: number) => {
            const localRef = document.getElementById(id) as HTMLDivElement

            if (localRef && direction == "horizontal") {
                localRef.style.width = `${sizeInPercent * 100}%`
            } else if (localRef && direction == "vertical") {
                localRef.style.height = `${sizeInPercent * 100}%`
            }
        }

        useImperativeHandle(ref, () => ({
            setSize,
            calculateSize
        }), []);

        return <div id={id} {...mergeCode0Props("d-split-pane", props)} ref={ref as React.LegacyRef<any>}>
            {children}
        </div>
    })

export default React.memo(DSplitPane)