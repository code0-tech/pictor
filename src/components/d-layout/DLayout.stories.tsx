import {Meta} from "@storybook/react-vite";
import {DLayout} from "./DLayout";
import React from "react";
import {Text} from "../text/Text";

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
    return <DLayout leftContent={<Text>Left</Text>}
             rightContent={<Text>Right</Text>}
             topContent={<Text>Top</Text>}
             bottomContent={<Text>Bottom</Text>}>
        <>
            <Text>Text</Text>
            <div style={{marginBottom: "200vh"}}/>
            <Text>Text</Text>
        </>
    </DLayout>

}