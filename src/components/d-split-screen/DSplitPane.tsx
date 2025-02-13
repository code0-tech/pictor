import {Code0Component} from "../../utils/types";
import React, {useEffect, useImperativeHandle} from "react";

import "./DSplitPane.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";

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
    calculateSize: (position: number) => number
}

const DSplitPane: React.ForwardRefExoticComponent<React.PropsWithoutRef<DSplitPaneProps> & React.RefAttributes<DSplitPaneHandle>> =
    React.forwardRef<DSplitPaneHandle, DSplitPaneProps>((props, ref) => {

        const {children, snap = true, visible = true, direction} = props
        const id = React.useId()

        const calculateSize = (position: number): number => {

            const localRef = document.getElementById(id) as HTMLDivElement
            const parentContainer = localRef?.parentElement
            const bBPane = localRef?.getBoundingClientRect()
            const bBContainer = parentContainer?.getBoundingClientRect()
            let size = direction == "horizontal" ? bBPane.width : bBPane.height

            //the position is either the x or y coordinate of the splitter
            const firstBorder = direction == "horizontal" ? bBPane.left : bBPane.top
            const secondBorder = direction == "horizontal" ? bBPane.right : bBPane.bottom

            //calculate new size based upon the new position
            //Pane can be scaled up or scaled down

            //for horizontal:
            //If the position is smaller than the right side or higher than the left side the
            //pane gets smaller
            if (position < secondBorder || position > firstBorder) {
                //TODO
            }

            //for vertical:
            //If the position is higher than the right side or lower than the left side the
            //pane gets bigger
            if (position > secondBorder || position < firstBorder) {
                //TODO
            }

            //If snap is enabled and the new size is inside the snap position we snap
            //to the snap position, which is always the standard mount size

            return size

        }

        const setSize = (sizeInPercent: number) => {
            const localRef = ref as React.RefObject<HTMLDivElement>

            if (localRef.current) {
                localRef.current.style.width = `${sizeInPercent}%`
            }
        }

        useImperativeHandle(ref, () => ({
            setSize,
            calculateSize
        }), []);

        return <div id={id} className={"d-split-pane"} ref={ref as React.LegacyRef<any>}>
            {children}
        </div>
    })

export default React.memo(DSplitPane)