import {Meta, StoryObj} from "@storybook/react-vite";
import React from "react";
import {Icon} from "./Icon";
import {Flex} from "../flex/Flex";

const meta: Meta<typeof Icon> = {
    title: "Icon",
    component: Icon,
    args: {
        icon: "tabler:git-branch",
        size: 24,
        color: "currentColor"
    }
}

export default meta

export const Sources = () => {
    return <Flex style={{gap: ".5rem", alignItems: "center"}}>
        <Icon color={"#fff"} icon={"tabler:brand-github"}/>
        <Icon color={"#fff"} icon={"simple:github"}/>
        <Icon color={"#fff"} icon={"codezero:codezero"}/>
        <Icon color={"#fff"} icon={"codezero:gls"}/>
    </Flex>
}

export const Naming = () => {
    return <Flex style={{gap: ".5rem", alignItems: "center"}}>
        <Icon color={"#fff"} icon={"tabler:arrow-left"}/>
        <Icon color={"#fff"} icon={"arrow-left"}/>
        <Icon color={"#fff"} icon={"ArrowLeft"}/>
        <Icon color={"#fff"} icon={"IconArrowLeft"}/>
    </Flex>
}

export const Sizes = () => {
    return <Flex style={{gap: ".5rem", alignItems: "center"}}>
        <Icon color={"#fff"} icon={"tabler:star"} size={16}/>
        <Icon color={"#fff"} icon={"tabler:star"} size={24}/>
        <Icon color={"#fff"} icon={"tabler:star"} size={32}/>
        <Icon color={"#fff"} icon={"tabler:star"} size={48}/>
    </Flex>
}

export const Colors = () => {
    return <Flex style={{gap: ".5rem", alignItems: "center"}}>
        <Icon icon={"tabler:heart-filled"} color={"#ff5c5c"}/>
        <Icon icon={"tabler:circle-check-filled"} color={"#4caf50"}/>
        <Icon icon={"tabler:bell-filled"} color={"#ffb300"}/>
        <Icon icon={"tabler:bolt"} color={"#3d7bff"}/>
    </Flex>
}

export const Stroke = () => {
    return <Flex style={{gap: ".5rem", alignItems: "center"}}>
        <Icon color={"#fff"} icon={"tabler:cloud"} stroke={1} size={32}/>
        <Icon color={"#fff"} icon={"tabler:cloud"} stroke={1.5} size={32}/>
        <Icon color={"#fff"} icon={"tabler:cloud"} stroke={2} size={32}/>
        <Icon color={"#fff"} icon={"tabler:cloud"} stroke={3} size={32}/>
    </Flex>
}

export const Fallback = () => {
    return <Flex style={{gap: ".5rem", alignItems: "center"}}>
        <Icon color={"#fff"} icon={"tabler:this-icon-does-not-exist"}/>
    </Flex>
}
