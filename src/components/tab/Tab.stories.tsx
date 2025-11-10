import {Meta} from "@storybook/react";
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
                    Overview
                </Button>
            </TabTrigger>
            <TabTrigger value={"organizations"}>
                <Button variant={"none"}>
                    <IconBuilding size={16}/>
                    Organizations
                </Button>
            </TabTrigger>
        </TabList>
        <TabContent value={"overview"}>
            <Text>Overview</Text>
        </TabContent>
        <TabContent value={"organizations"}>
            <Text>Organizations</Text>
        </TabContent>
    </Tab>
}

export const TabExampleVertical = () => {
    return <Tab orientation={"vertical"} defaultValue={"overview"}>
        <TabList>
            <TabTrigger value={"overview"}>
                <Button variant={"none"}>
                    <IconHome size={16}/>
                    Overview
                </Button>
            </TabTrigger>
            <TabTrigger value={"organizations"}>
                <Button variant={"none"}>
                    <IconBuilding size={16}/>
                    Organizations
                </Button>
            </TabTrigger>
        </TabList>
        <TabContent w={"200px"} value={"overview"}>
            <Text>Overview</Text>
        </TabContent>
        <TabContent w={"200px"} value={"organizations"}>
            <Text>Organizations</Text>
        </TabContent>
    </Tab>
}