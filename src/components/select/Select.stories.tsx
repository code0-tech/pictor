import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Button from "../button/Button";
import {Placement} from "react-aria";
import {IconBulbOff, IconDisabled, IconLogout, IconUserCancel, IconUserEdit} from "@tabler/icons-react";
import Badge from "../badge/Badge";
import Select from "./Select";
import Menu from "../menu/Menu";

const meta: Meta = {
    title: "Select",
    component: Select,
    argTypes: {
        defaultValue: {
            type: "string",
            defaultValue: "1"
        },
        label: {
            type: "string",
            defaultValue: "This is a label"
        }
    }
}

export default meta;

type MenuStory = StoryObj<{ defaultValue: string, label: string }>

export const BasicSelect: MenuStory = {
    render: (args) => {

        const {defaultValue, label} = args

        return <>
            <Select description={"Lorem ipsum"} defaultValue={defaultValue}>
                <Select.Label>{label}</Select.Label>
                <Select.Option>Lorem ipsum 1</Select.Option>
                <Select.Option>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const BasicSelectWithOutDeselect: MenuStory = {
    render: (args) => {

        return <>
            <Select forbidDeselect description={"Lorem ipsum"} defaultValue={"Lorem ipsum 1"}>
                <Select.Option>Lorem ipsum 1</Select.Option>
                <Select.Option>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}


export const DisabledSelect: MenuStory = {
    render: (args) => {

        const {defaultValue} = args

        return <>
            <Select description={"Lorem ipsum"} defaultValue={defaultValue} disabled>
                <Select.Icon><IconBulbOff></IconBulbOff></Select.Icon>
            </Select>
        </>
    }
}
