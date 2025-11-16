import React from "react"
import {Toast, toast} from "./Toast"
import {Meta, StoryObj} from "@storybook/react-vite"
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
            title: "Cannot delete the last administrative role",
            color: "warning",
            dismissible: true,
            duration: 10000,
            children: <Text>Some content</Text>
        })
    }

    return (
        <div className={"h-screen w-screen flex items-center justify-center"}>
            <Toaster className={"sdsasa"} duration={Infinity} position="top-right"/>
            <Button onClick={() => renderToast()}>
                Test
            </Button>
        </div>
    )
}