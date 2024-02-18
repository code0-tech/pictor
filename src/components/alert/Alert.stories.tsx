import React from "react";
import Alert from "./Alert";
import {Meta, StoryObj} from "@storybook/react";
import {Colors} from "../../utils/utils";

const meta: Meta<typeof Alert> = {
    title: "Alert",
    component: Alert,
    argTypes: {
        dismissible: {
            type: "boolean"
        },
        icon: {
            type: "boolean"
        },
        onClose: {table:{disable: true}},
        title: {table:{disable: true}},
        color: {table:{disable: true}}
    },
}

export default meta
type Story = StoryObj<typeof Alert>;

export const WithBody: Story = {
    render: (args) => {

        const {dismissible, icon} = args

        return <>
            {
                Colors.map(value => {
                    return <Alert color={value} onClose={event => window.alert("closed")} dismissible={dismissible} icon={icon} title={value}>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                    </Alert>
                })
            }
        </>

    },
    args: {
        dismissible: false,
        icon: true
    }
}

export const WithoutBody: Story = {
    render: (args) => {

        const {dismissible, icon} = args

        return <>
            {
                Colors.map(value => {
                    return <Alert color={value} onClose={event => window.alert("closed")} dismissible={dismissible} icon={icon} title={value}/>
                })
            }
        </>

    },
    args: {
        dismissible: false,
        icon: true
    }
}