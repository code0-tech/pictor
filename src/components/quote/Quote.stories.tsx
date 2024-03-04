import {Meta, StoryObj} from "@storybook/react";
import Menu from "../menu/Menu";
import {Placement} from "react-aria";
import {Quote} from "./Quote";
import React from "react";

const meta: Meta = {
    title: "Quote",
    component: Quote,
}

export default meta;

type MenuStory = StoryObj


export const MenuAccount: MenuStory = {
    render: (args) => {
        return <Quote name={"Name"} logo={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}  position={"Position"}>
            My favorite UX feedback from customers is:
            "How is the app so fast?"
            Because we’ve built on Next.js and Vercel since day one, our pages load in an instant,
            which is important when it comes to mission-critical software.
        </Quote>
    }
}


