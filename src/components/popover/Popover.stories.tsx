import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Popover from "./Popover";
import Button from "../button/Button";
import {Placement} from "react-aria";

const meta: Meta = {
    title: "Popover",
    component: Popover,
    argTypes: {
        placement: {
            options: ['left start', 'left end', 'bottom start', 'bottom end', 'top start', 'top end', 'right start', 'right end'],
            control: {type: 'radio'},
        }
    }
}

export default meta;

type PopoverStory = StoryObj<{ placement: Placement }>

export const PopoverTest: PopoverStory = {
    render: (args) => {
        const {placement} = args

        return <Popover placement={placement}>
            <Popover.Trigger>
                <Button>Click me</Button>
            </Popover.Trigger>
            <Popover.Content>
                This is a popover content
            </Popover.Content>
        </Popover>
    }
}