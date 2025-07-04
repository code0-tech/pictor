import {Meta} from "@storybook/react";
import DZoomPanPinch from "./DZoomPanPinch";
import FlowLinesProvider, {useFlowLines} from "../flow-line/FlowLinesProvider";
import React from "react";
import Flex from "../flex/Flex";
import Quote from "../quote/Quote";
import {FlowLineExample} from "../flow-line/FlowLines.stories";

const meta: Meta = {
    title: "Zoom Pan Pinch",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
    component: DZoomPanPinch
}

export default meta

export const ZoomPanPinchExample = () => {

    return <DZoomPanPinch>
        <FlowLinesProvider>
            <FlowLineExample/>
        </FlowLinesProvider>
    </DZoomPanPinch>
}
