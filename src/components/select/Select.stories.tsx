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
            defaultValue: "Lorem ipsum 2"
        },
        label: {
            type: "string",
            defaultValue: "This is a label"
        },
        error: {
            type: "string",
            defaultValue: "There is an error"
        },
        success: {
            type: "string",
            defaultValue: "This is working (Success)"
        },
    }
}

export default meta;

type MenuStory = StoryObj<{ defaultValue: string, label: string, error: string, success: string }>

export const Selection: MenuStory = {
    render: (args) => {

        const {defaultValue, label} = args

        return <>
            <Select onSelectionChange={(event, selection) => {
                console.log(event.getNewSelectionAsString())
            }} label={label} description={"Lorem ipsum"} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const NoDeselect: MenuStory = {
    render: (args) => {

        return <>
            <Select disallowDeselection description={"This component uses `disallowDeselection`"} defaultValue={"2"}
                    label={"You cant deselect this"}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Error: MenuStory = {
    render: (args) => {

        const {defaultValue, label, error} = args

        return <>
            <Select onSelectionChange={(event, selection) => {
                console.log(event.getNewSelectionAsString())
            }} error={<Badge>{error}</Badge>} label={label} description={"Lorem ipsum"} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Success: MenuStory = {
    render: (args) => {

        const {defaultValue, label, success} = args

        return <>
            <Select onSelectionChange={(event, selection) => {
                console.log(event.getNewSelectionAsString())
            }} success={<Badge>{success}</Badge>} label={label} description={"Lorem ipsum"} defaultValue={defaultValue}>
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Clearable: MenuStory = {
    render: (args) => {

        const {defaultValue} = args

        return <>
            <Select clearable label={"Test"} description={"Lorem ipsum"} defaultValue={defaultValue} >
                <Select.Option key={"Lorem ipsum 1"}>Lorem ipsum 1</Select.Option>
                <Select.Option key={"Lorem ipsum 2"}>Lorem ipsum 2</Select.Option>
            </Select>
        </>
    }
}

export const Disabled: MenuStory = {
    render: (args) => {

        const {defaultValue} = args

        return <>
            <Select label={"Test"} description={"Lorem ipsum"} defaultValue={defaultValue} disabled>

            </Select>
        </>
    }
}
