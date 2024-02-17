import Navigation from "./Navigation";
import {StoryObj} from "@storybook/react";
import React from "react";
import NavigationItem from "./NavigationItem";
import Button from "../button/Button";

const meta = {
    title: "Navigation",
    component: Navigation
}

type NavigationStory = StoryObj

export const Navigations: NavigationStory = {
    render: () => {
        return <>
            <Navigation>
                <NavigationItem url={""}>
                    <Button active={true} disabled={false}> Home </Button>
                </NavigationItem>
                <NavigationItem url={""}>
                    <Button active={true} disabled={false}> Settings </Button>
                </NavigationItem>
                <NavigationItem url={""}>
                    <Button active={true} disabled={false}> Shop </Button>
                </NavigationItem>
                <NavigationItem url={""}>
                    <Button active={true} disabled={false}> Account </Button>
                </NavigationItem>
                <NavigationItem url={""}>
                    <Button active={true} disabled={false}> Blog </Button>
                </NavigationItem>
            </Navigation>
        </>
    }
}

export default meta;