import {StoryObj} from "@storybook/react-vite";
import React from "react";
import {IconAbc, IconPhoneFilled, IconSparkles} from "@tabler/icons-react";
import {Colors} from "../../utils";
import {GradientButton} from "./GradientButton";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";

const meta = {
    title: "Gradient Button",
    component: GradientButton,
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
            options: ['none', 'normal', 'outlined'],
            control: {type: 'radio'},
        },
        color: {table: {disable: true}}
    }
}

type ButtonStory = StoryObj<{ icon: boolean, disabled: boolean, variant: string }>;

export default meta

export const Buttons: ButtonStory = {
    render: (args) => {

        const {icon, disabled, variant} = args

        return <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {
                Colors.map(value => {
                    // @ts-ignore
                    return <GradientButton variant={variant} disabled={disabled} color={value}>
                        {icon ? <IconSparkles size={16}/> : null}
                        <Text>
                            Upgrade to
                        </Text>
                        <Badge>
                            Team
                        </Badge>
                    </GradientButton>
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
    return <GradientButton color={"secondary"} variant={"outlined"}
                           style={{aspectRatio: "1/1"}}><IconPhoneFilled size={16}/></GradientButton>
}

export const GetPro = () => {
    return <GradientButton color={"info"}
                           variant={"outlined"}>
        <IconSparkles size={16}/>
        <Text>
            Get CodeZero Pro
        </Text>
    </GradientButton>
}
