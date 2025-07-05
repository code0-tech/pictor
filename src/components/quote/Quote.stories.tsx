import {Meta, StoryObj} from "@storybook/react";
import Quote from "./Quote";
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


export const QuoteWithLogo: QuoteStory = {
    render: (args) => {
        return <Quote {...args} name={"Nico Sammito"}
                      position={"Co-founder"}
                      logo={"https://code0.tech/code0_logo.png"}
                      w={"300px"}>
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
        borderColor: "secondary",
        inlineBorder: true
    }
}

export const QuoteWithoutLogo: QuoteStory = {
    render: (args) => {
        return <Quote {...args} name={"Nico Sammito"}
                      position={"Co-founder"}
                      w={"300px"}>
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
        borderColor: "secondary",
        gradient: true,
        inlineBorder: true
    }
}


