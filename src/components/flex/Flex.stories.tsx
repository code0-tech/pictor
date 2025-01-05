import {Meta} from "@storybook/react";
import React from "react";
import Flex from "./Flex";
import Text from "../text/Text";

const meta: Meta = {
    title: "Flex",
    component: Flex
}

export default meta

export const ExampleFlex = () => {

    return <Flex>
        <Text size={"md"} mr={1}>Example Text 1</Text>
        <Text size={"md"}>Example Text 2</Text>
    </Flex>

}