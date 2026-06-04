import {Meta} from "@storybook/react-vite";
import {Progress} from "./Progress";
import React from "react";
import {Card} from "../card/Card";
import {Spacing} from "../spacing/Spacing";
import {Text} from "../text/Text";
import {IconAi, IconPlane, IconPlaneFilled} from "@tabler/icons-react";

export default {
    title: "Progress",
    component: Progress,
} as Meta

export const ProgressExample = () => {
    return <Card color={"primary"} w={"300px"}>
        <Progress value={50} predictionValue={75} max={100} color={"linear-gradient(to right, #29BF12 0%, #D90429 100%)"}/>
        <Spacing spacing={"xs"}/>
        <Text>
            You used 50% of your available workflow executions and will used 75% until its reseted.
        </Text>
        <Spacing spacing={"xl"}/>
        <Progress value={30} predictionValue={70} max={100} color={"#70ffb2"}/>
        <Spacing spacing={"xs"}/>
        <Text>
            You used 30% of your available workflow executions and will used 120% until its reseted.
            You need to upgrade your plan to be able to execute workflows seamlessly.
        </Text>
    </Card>
}