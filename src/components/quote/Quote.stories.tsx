import {Meta, StoryObj} from "@storybook/react";
import {Quote} from "./Quote";
import React from "react";
import {Colors} from "../../utils/types";

const meta: Meta = {
    title: "Quote",
    component: Quote,
    argTypes: {
        color: {
            options: Colors,
            control: {type: "radio"}
        },
        variant: {
            options: ['none', 'normal', 'filled', 'outlined'],
            control: {type: 'radio'},
        },
        gradient: {
            type: "boolean"
        },
        gradientPosition: {
            options: ["top-left", "top-right", "bottom-right", "bottom-left"],
            control: {type: 'radio'},
        },
        outline: {
            type: "boolean"
        },
        inlineBorder: {
            type: "boolean"
        }
    }
}

export default meta;

type QuoteStory = StoryObj<typeof Quote>;


export const QuoteSample: QuoteStory = {
    render: (args) => {
        return <Quote  {...args} name={"Nico Sammito"}
                      logo={"https://avatars.githubusercontent.com/u/150623800?s=200&v=4"}
                      position={"Co-founder"}
                      style={{width: "200px"}}>
            My favorite UX feedback from customers is:
            "How is the app so fast?"
            Because we’ve built on Next.js and Vercel since day one, our pages load in an instant,
            which is important when it comes to mission-critical software.
        </Quote>
    },
    args: {
        variant: "outlined",
        color: "secondary",
        outline: false,
        gradient: true,
        gradientPosition: "bottom-left",
        inlineBorder: true
    }
}


