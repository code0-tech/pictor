import {Meta} from "@storybook/react-vite";
import {Alert} from "./Alert";
import React from "react";

export default {
    title: "Alert",
    component: Alert
} as Meta

export const AlertExample = () => {
    return <Alert color={"error"}>
        This is an alert message!
    </Alert>
}