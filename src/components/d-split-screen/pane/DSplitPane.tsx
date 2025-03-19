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

    return <div {...mergeCode0Props(`d-split-pane`, props)} ref={ref}>
        {children}
    </div>
})

export default React.memo(DSplitPane)