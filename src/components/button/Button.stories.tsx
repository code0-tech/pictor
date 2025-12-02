import {Button} from "./Button";
import {StoryObj} from "@storybook/react-vite";
import React from "react";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {IconAbc, IconPhoneFilled} from "@tabler/icons-react";
import {Colors} from "../../utils/types";

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
        variant: {
            options: ['none', 'normal', 'outlined', 'filled'],
            control: {type: 'radio'},
        },
        color: {table: {disable: true}}
    }
}

type ButtonStory = StoryObj<{ icon: boolean, disabled: boolean, variant: string }>;
type ButtonGroupStory = StoryObj<typeof ButtonGroup>;

export default meta

export const Buttons: ButtonStory = {
    render: (args) => {

        const {icon, disabled, variant} = args

        return <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {
                Colors.map(value => {
                    // @ts-ignore
                    return <Button variant={variant} disabled={disabled} color={value}>
                        {icon ? <IconAbc/> : null}
                        {value}
                    </Button>
                })
            }
        </div>
    },
    args: {
        icon: true,
        disabled: false,
        variant: "normal"
    }
}

export const ButtonIcon = () => {
    return <Button color={"secondary"} variant={"outlined"} style={{aspectRatio: "1/1"}}><IconPhoneFilled/></Button>
}

export const ButtonGroups: ButtonGroupStory = {
    render: () => {
        return <>
            <ButtonGroup>
                {
                    Colors.map((value, index) => {
                        return <Button color={value}>
                            {(index % 2) == 0 ? <IconAbc/> : null}
                            {value}
                        </Button>
                    })
                }
            </ButtonGroup>
            <ButtonGroup>
                {
                    ["primary", "primary", "primary", "primary"].map((value, index) => {
                        // @ts-ignore
                        return <Button color={value}>
                            {(index % 2) == 0 ? <IconAbc/> : null}
                            {value}
                        </Button>
                    })
                }
            </ButtonGroup>

            <ButtonGroup>
                {
                    ["secondary", "secondary", "secondary", "secondary"].map((value, index) => {
                        // @ts-ignore
                        return <Button disabled={(index % 2) == 0} color={value}>
                            {(index % 2) == 0 ? <IconAbc/> : null}
                            {value}
                        </Button>
                    })
                }
            </ButtonGroup>
        </>
    }
}