import Text from "./Text";
import React from "react";
import {Colors, Size, Sizes} from "../../utils/types";
import {Button, ButtonGroup} from "../../index";
import Alert from "../alert/Alert";
import {StoryObj} from "@storybook/react";


export default {
    title: "Font",
    component: Text,
    argTypes: {
        size: {
            options: ["xs", "sm", "md", "lg", "xl"],
            control: {type: 'radio'}
        }
    }
};


export const TextSizes: StoryObj<typeof Text> = {
    render: (args) => {
        const {size} = args

        return <>
                <Text size={size}>{size}</Text>
        </>
    },
    args: {
        size: "sm"
    }
}