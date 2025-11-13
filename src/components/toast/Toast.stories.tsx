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
            title: 'This is a headless toast',
            color: "warning",
            dismissible: true,
            children: <Text hierarchy={"tertiary"}>'You can customize the content of the toast as you like.'</Text>
        })
    }

    return (
        <div className={"h-screen w-screen flex items-center justify-center"}>
            <Toaster position="top-right"/>
            <Button onClick={() => renderToast()}>
                Test
            </Button>
        </div>
    )
}