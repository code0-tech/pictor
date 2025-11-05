import {Meta} from "@storybook/react";
import {DLayout} from "./DLayout";
import React from "react";
import {Text} from "../text/Text";
import DFullScreen from "../d-fullscreen/DFullScreen";

const meta: Meta = {
    title: "Dashboard Layout",
    component: DLayout,
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export default meta


export const DashboardLayoutExample = () => {
    return <DFullScreen>
        <DLayout leftContent={<Text>Left</Text>}
                 rightContent={<Text>Right</Text>}
                 topContent={<Text>Top</Text>}
                 bottomContent={<Text>Bottom</Text>}>
            <Text>Text</Text>
        </DLayout>
    </DFullScreen>
}