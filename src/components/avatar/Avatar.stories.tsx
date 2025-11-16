import {Meta} from "@storybook/react-vite";
import React from "react";
import {Avatar} from "./Avatar";
import {Flex} from "../flex/Flex";

const meta: Meta = {
    title: "Avatar",
    component: Avatar
}

export default meta

export const AvatarExample = () => {
    return <Flex style={{gap: ".35rem"}}>
        <Avatar identifier={"nsammito@code0.tech"}/>
        <Avatar src={"https://avatars.githubusercontent.com/u/60352747?v=4"}/>
        <Avatar identifier={"rgoetz@code0.tech"}/>
    </Flex>
}