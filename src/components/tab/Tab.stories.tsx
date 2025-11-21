import {Meta} from "@storybook/react-vite";
import {Tab, TabContent, TabList, TabTrigger} from "./Tab";
import {Button} from "../button/Button";
import {Text} from "../text/Text";
import React from "react";
import {IconHome, IconBuilding} from "@tabler/icons-react";

export default {
    title: "Tab",
} as Meta

export const TabExample = () => {
    return <Tab orientation={"horizontal"} defaultValue={"overview"}>
        <TabList>
            <TabTrigger value={"overview"}>
                <Button variant={"none"}>
                    <IconHome size={16}/>
                    <Text size={"md"} hierarchy={"primary"}>Collaborative documents</Text>
                </Button>
            </TabTrigger>
            <TabTrigger value={"organizations"}>
                <Button variant={"none"}>
                    <IconBuilding size={16}/>
                    <Text size={"md"} hierarchy={"primary"}>Inline comments</Text>
                </Button>
            </TabTrigger>
        </TabList>
    </Tab>
}

export const TabExampleVertical = () => {
    return <Tab orientation={"vertical"} defaultValue={"overview"}>
        <TabList>
            <TabTrigger value={"overview"}>
                <Button paddingSize={"xxs"} variant={"none"}>
                    <Text size={"md"} hierarchy={"primary"}>Collaborative documents</Text>
                </Button>
            </TabTrigger>
            <TabTrigger value={"organizations"}>
                <Button paddingSize={"xxs"} variant={"none"}>
                    <Text size={"md"} hierarchy={"primary"}>Inline comments</Text>
                </Button>
            </TabTrigger>
            <TabTrigger value={"commands"}>
                <Button paddingSize={"xxs"} variant={"none"}>
                    <Text size={"md"} hierarchy={"primary"}>Text-to-issue commands</Text>
                </Button>
            </TabTrigger>
        </TabList>
    </Tab>
}