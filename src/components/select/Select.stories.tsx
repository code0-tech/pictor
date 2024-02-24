import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import {IconBulbOff} from "@tabler/icons-react";
import Select from "./Select";
import Badge from "../badge/Badge";

const meta: Meta = {
    title: "Select",
    component: Select,
    argTypes: {
        defaultValue: {
            type: "string",
        },
        label: {
            type: "string",
        },
        error: {
            type: "string",
        },
        success: {
            type: "string",
        },
    }
}

export default meta;

export interface SelectType {
    error: string,
    success: string,
    defaultValue: string,
    clearable: boolean,
    label: string,
    description: string,
    disallowDeselection: boolean,
}

type MenuStory = StoryObj<SelectType>

export const Selection: MenuStory = {
    render: (args) => {

        const {defaultValue, description, label} = args

        return <>
            <Select label={label} description={description} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const NoDeselect: MenuStory = {
    render: (args) => {

        const {defaultValue, label, description} = args

        return <>
            <Select disallowDeselection description={description} defaultValue={defaultValue}
                    label={label}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Error: MenuStory = {
    render: (args) => {

        const {defaultValue, description, label, error} = args

        return <>
            <Select error={<Badge>{error ?? ""}</Badge>} label={label} description={description} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Success: MenuStory = {
    render: (args) => {

        const {defaultValue, description, label, success} = args

        return <>
            <Select success={<Badge>{success ?? ""}</Badge>} label={label} description={description} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Clearable: MenuStory = {
    render: (args) => {

        const {defaultValue, description, label} = args

        return <>
            <Select clearable label={label} description={description} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Disabled: MenuStory = {
    render: (args) => {

        const {defaultValue, description, label} = args

        return <>
            <Select disabled label={label} description={description} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}
