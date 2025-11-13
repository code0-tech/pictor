import React from "react"
import {Toast, toast} from "./Toast"
import {Meta, StoryObj} from "@storybook/react"
import {Button} from "../button/Button"
import {Toaster} from "sonner"
import {Text} from "../text/Text";

const meta: Meta<typeof Toast> = {
    title: "Toast",
    component: Toast
}

export default meta
type Story = StoryObj<typeof Toast>;

export const ExampleToast = () => {

    const renderToast = () => {
        toast({
            title: "Error",
            color: "error",
            dismissible: true,
            children: "INVALID_LOGIN_DATA",
        })
    }

    return (
        <div className={"h-screen w-screen flex items-center justify-center"}>
            <Toaster duration={Infinity} position="top-right"/>
            <Button onClick={() => renderToast()}>
                Test
            </Button>
        </div>
    )
}