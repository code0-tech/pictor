import React from "react";
import {Meta} from "@storybook/react";
import DScreenBar from "../d-screen/DScreenBar";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DScreen from "../d-screen/DScreen";
import Text from "../text/Text";

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
        <DScreen>
            <DScreenBar type={"left"} justify={"space-between"} resizeable>

                <Text>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </Text>
            </DScreenBar>
            <DScreenBar type={"right"} resizeable>
                <Text>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </Text>
            </DScreenBar>

            <DScreen>
                <Text>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </Text>
            </DScreen>
        </DScreen>
    </DFullScreen>

}

export default meta