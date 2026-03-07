import {Meta} from "@storybook/react-vite";
import {Layout} from "./Layout";
import React from "react";
import {Text} from "../text/Text";

const meta: Meta = {
    title: "Dashboard Layout",
    component: Layout,
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export default meta


export const DashboardLayoutExample = () => {
    return <Layout leftContent={<Text>Left</Text>}
                   rightContent={<Text>Right</Text>}
                   topContent={<Text>Top</Text>}
                   bottomContent={<Text>Bottom</Text>}>
        <>
            <Text>Content</Text>
            <div style={{marginBottom: "200vh"}}/>
            <Text>Content</Text>
        </>
    </Layout>

}