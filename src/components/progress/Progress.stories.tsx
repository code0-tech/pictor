import {Meta} from "@storybook/react-vite";
import {ProgressLinear} from "./ProgressLinear";
import {ProgressCircle} from "./ProgressCircle";
import React from "react";
import {Card} from "../card/Card";
import {Spacing} from "../spacing/Spacing";
import {Text} from "../text/Text";
import {Flex} from "../flex/Flex";

export default {
    title: "Progress",
    component: ProgressLinear,
} as Meta

export const Linear = () => {
    return <Card color={"primary"} w={"300px"}>
        <ProgressLinear value={50} predictionValue={75} max={100}
                        color={"linear-gradient(to right, #29BF12 0%, #D90429 100%)"}/>
        <Spacing spacing={"xs"}/>
        <Text>
            You used 50% of your available workflow executions and will used 75% until its reseted.
        </Text>
        <Spacing spacing={"xl"}/>
        <ProgressLinear value={30} max={100} color={"#70ffb2"}/>
        <Spacing spacing={"xs"}/>
        <Text>
            You used 30% of your available workflow executions and will used 120% until its reseted.
            You need to upgrade your plan to be able to execute workflows seamlessly.
        </Text>
    </Card>
}

export const Circle = () => {
    return <Card color={"primary"} w={"300px"}>
        <Flex style={{gap: "1.5rem", alignItems: "center"}}>
            <ProgressCircle value={50} size={64} predictionValue={75} max={100} color={"#70ffb2"}
                            dot={<Text>50%</Text>}/>
            <ProgressCircle value={30} size={16} max={100} color={"#70ffb2"}/>
        </Flex>
        <Spacing spacing={"xs"}/>
        <Text>
            The circle shares the same interface and design as the linear variant –
            value, predictionValue, color and dot behave identically.
        </Text>
    </Card>
}
