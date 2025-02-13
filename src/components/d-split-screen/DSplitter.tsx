import React from "react";
import {DSplitPaneHandle} from "./DSplitPane";

import "./DSplitter.style.scss"
import {DSplitScreenDirection} from "./DSplitScreen";

export interface DSplitterProps {
    firstPane?: React.RefObject<DSplitPaneHandle & HTMLDivElement>
    secondPane?: React.RefObject<DSplitPaneHandle & HTMLDivElement>
    direction?: DSplitScreenDirection
}

const DSplitter: React.FC<DSplitterProps> = (props) => {

    const {firstPane, secondPane, direction = "horizontal"} = props

    return <div className={`d-splitter d-splitter--${direction}`}/>
}

export default DSplitter