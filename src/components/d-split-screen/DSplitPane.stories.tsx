import React, {useEffect} from "react";
import {Meta} from "@storybook/react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DSplitScreen from "./DSplitScreen";
import DSplitPane, {DSplitPaneHandle} from "./DSplitPane";

const meta: Meta = {
    title: "DSplitPane",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export const test = () => {


    return <DFullScreen>
        <DSplitScreen direction={"horizontal"}>
            <DSplitPane w={"33.3333333%"}>
               s
            </DSplitPane>
            <DSplitPane w={"33.3333333%"}>
                s
            </DSplitPane>
            <DSplitPane w={"33.3333333%"}>
                s
            </DSplitPane>
        </DSplitScreen>
    </DFullScreen>

}

export default meta