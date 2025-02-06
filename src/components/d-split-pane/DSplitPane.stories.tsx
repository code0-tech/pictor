import React from "react";
import {Meta} from "@storybook/react";
import DScreenBar from "../d-screen/DScreenBar";
import Button from "../button/Button";
import DFullScreen from "../d-fullscreen/DFullScreen";
import Flex from "../flex/Flex";

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

    return <DFullScreen style={{display: "flex"}}>

            <DScreenBar type={"left"} resizeable>
                <Button>Test</Button>
            </DScreenBar>

            <DScreenBar type={"left"} resizeable>
                <Button>Test</Button>
            </DScreenBar>

            <DScreenBar type={"left"} resizeable>
                <Button>Test</Button>
            </DScreenBar>



    </DFullScreen>

}

export default meta