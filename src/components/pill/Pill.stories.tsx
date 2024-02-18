import {Meta, StoryObj} from "@storybook/react";
import Pill from "./Pill";
import React from "react";

const meta: Meta = {
    title: "Pill",
    component: Pill,
    argTypes: {
        dismissible: {
            type: "boolean"
        },
        size: {
            control: {type: 'radio'},
            options: ["xs", "sm", "md", "lg", "xl"]
        }
    },
}

export default meta;

type MenuStory = StoryObj<{dismissible: boolean, size: string}>

export const BasicPill: MenuStory = {
    render: (args) => {

        const {dismissible, size} = args

        return <>
            {
                ["primary", "secondary", "info", "success", "warning", "error"].map(value => {
                    // @ts-ignore
                    return <Pill size={size} variant={value} onClose={() => window.alert("closed")} removeButton={dismissible}
                                 title={value}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</Pill>
                })
            }
        </>

    },
    args: {
        dismissible: false,
        size: "md"
    }
}

export const WithHref: MenuStory = {
    render: (args) => {

        const {dismissible, size} = args

        // @ts-ignore
        return <Pill size={size} variant={"success"} removeButton={dismissible} href={"https://google.com"}>enhancement</Pill>




    },
    args: {
        dismissible: false,
        size: "md"
    }
}

