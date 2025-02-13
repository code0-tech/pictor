import {Code0Component} from "../../utils/types";
import React, {useImperativeHandle} from "react";

import "./DSplitPane.style.scss"

export interface DSplitPaneProps extends Code0Component<HTMLDivElement> {
    //defaults to true
    visible?: boolean
    //defaults to true
    snap?: boolean
    children: React.ReactNode
}

export interface DSplitPaneHandle {
    test: () => void
}

const DSplitPane: React.FC = React.forwardRef<DSplitPaneHandle, DSplitPaneProps>((props, ref) => {

    const {children, snap = true, visible = true} = props

    useImperativeHandle(ref, () => ({
        test: () => {
            console.log("TEST", snap)
        }
    }));

    return <div className={"d-split-pane"} ref={ref as React.LegacyRef<any>}>
        {children}
    </div>
})

export default React.memo(DSplitPane)