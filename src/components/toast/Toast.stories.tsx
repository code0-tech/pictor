import React from "react"
import {Toast, toast} from "./Toast"
import {Meta, StoryObj} from "@storybook/react-vite"
import {Button} from "../button/Button"
import {Toaster} from "sonner"
import {Text} from "../text/Text";
import {Flex} from "../flex/Flex";
import {IconRocket, IconSparkles} from "@tabler/icons-react";

const meta: Meta<typeof Toast> = {
    title: "Toast",
    component: Toast,
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export default meta
type Story = StoryObj<typeof Toast>;

export const ExampleToast = () => {

    const renderToast = () => {
        toast({
            title: "Cannot delete the last administrative role",
            color: "info",
            duration: Infinity,
            children: <Flex w={"100%"} style={{flexDirection: "column", gap: "0.7rem"}}>
                <Text hierarchy={"tertiary"}>
                    You used 50% of your available workflow executions and will used 75% until its reseted.
                </Text>
                <Flex align={"center"} style={{gap: "0.7rem"}}>
                    <Button w={"100%"}>
                        Add new license
                    </Button>
                    <Button w={"100%"}>
                        Buy new license
                    </Button>
                </Flex>
            </Flex>
        })
    }

    const renderCustomColorToast = () => {
        toast({
            title: "Your export is ready to download",
            color: "#a855f7",
            icon: <IconRocket size={16}/>,
            duration: Infinity,
            children: <Text hierarchy={"tertiary"}>
                This toast uses a custom CSS color for its icon and title.
            </Text>
        })
    }

    const renderCustomIconToast = () => {
        toast({
            title: "Launch successful",
            color: "#f97316",
            icon: <IconRocket size={16}/>,
            duration: Infinity,
            children: <Text hierarchy={"tertiary"}>
                A custom icon paired with a custom orange color.
            </Text>
        })
    }

    const renderPresetWithCustomIconToast = () => {
        toast({
            title: "New AI features available",
            color: "success",
            icon: <IconSparkles size={16}/>,
            duration: Infinity,
            children: <Text hierarchy={"tertiary"}>
                A preset color combined with your own icon.
            </Text>
        })
    }

    return (
        <>
            <Toaster position="top-center"/>
            <Button onClick={renderToast}>
                Test
            </Button>
            <Button onClick={renderCustomColorToast}>
                Custom color
            </Button>
            <Button onClick={renderCustomIconToast}>
                Custom icon + color
            </Button>
            <Button onClick={renderPresetWithCustomIconToast}>
                Preset color + custom icon
            </Button>
        </>
    )
}