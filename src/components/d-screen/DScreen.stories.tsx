import {Meta} from "@storybook/react";
import React from "react";
import DScreen from "./DScreen";

const meta: Meta = {
    title: "Dashboard Screen",
    parameters: {
        visualTest: {
            selector: 'body'
        }
    }
}

export const DashboardScreenExample = () => {
    return <DScreen>

    </DScreen>
}

export default meta