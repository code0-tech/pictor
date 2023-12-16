import Button from "./Button";
import {StoryObj} from "@storybook/react";
import React from "react";
import ButtonGroup from "../button-group/ButtonGroup";
import {IconAbc} from "@tabler/icons-react";

const meta = {
    title: "Button",
    component: Button,
    argTypes: {
        icon: {
            type: "boolean",
            default: true
        },
        disabled: {
            type: "boolean",
            default: false
        },
        variant: {table: {disable: true}}
    }
}

type ButtonStory = StoryObj<{ icon: boolean, disabled: boolean}>;
type ButtonGroupStory = StoryObj<typeof ButtonGroup>;

export default meta

export const Buttons: ButtonStory = {
    render: (args) => {

        const {icon, disabled} = args

        return <>
            {
                ["primary", "secondary", "info", "success", "warning", "error"].map(value => {
                    // @ts-ignore
                    return <Button disabled={disabled} variant={value}>
                        {icon ? <Button.Icon><IconAbc/></Button.Icon> : null}
                        {value}
                    </Button>
                })
            }
        </>
    },
    args: {
        icon: true,
        disabled: false
    }
}

export const ButtonGroups: ButtonGroupStory = {
    render: () => {
        return <>
            <ButtonGroup>
                {
                    ["primary", "secondary", "info", "success", "warning", "error"].map((value, index) => {
                        // @ts-ignore
                        return <Button variant={value}>
                            {(index % 2) == 0 ? <Button.Icon><IconAbc/></Button.Icon> : null}
                            {value}
                        </Button>
                    })
                }
            </ButtonGroup>
            <ButtonGroup>
                {
                    ["primary", "primary", "primary", "primary"].map((value, index) => {
                        // @ts-ignore
                        return <Button variant={value}>
                            {(index % 2) == 0 ? <Button.Icon><IconAbc/></Button.Icon> : null}
                            {value}
                        </Button>
                    })
                }
            </ButtonGroup>

            <ButtonGroup>
                {
                    ["primary", "primary", "primary", "primary"].map((value, index) => {
                        // @ts-ignore
                        return <Button disabled={(index % 2) == 0} variant={value}>
                            {(index % 2) == 0 ? <Button.Icon><IconAbc/></Button.Icon> : null}
                            {value}
                        </Button>
                    })
                }
            </ButtonGroup>

        </>
    }
}