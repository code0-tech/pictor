import Text from "./Text";
import React from "react";
import {StoryObj} from "@storybook/react";


export default {
    title: "Text",
    component: Text,
    argTypes: {
        size: {
            options: ["xs", "sm", "md", "lg", "xl"],
            control: {type: 'radio'}
        },
        hierarchy: {
            options: ["primary", "secondary", "tertiary"],
            control: {type: 'radio'}
        }
    }
};


export const TextSizes: StoryObj<typeof Text> = {
    render: (args) => {
        const {size, hierarchy} = args

        return <Text hierarchy={hierarchy} size={size}>{size}</Text>
    },
    args: {
        size: "sm",
        hierarchy: "secondary"
    }
}