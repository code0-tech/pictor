import MultiSelect from "./MultiSelect";
import {Meta, StoryObj} from "@storybook/react";
import React from "react";


const meta: Meta = {
    title: "MultiSelect",
    component: MultiSelect,
    argTypes: {
        clearable: {
            type: "boolean"
        }
    }
}


export default meta;

type MenuStory = StoryObj<typeof MultiSelect>

export const BasicMultiSelect: MenuStory = {
    render: (args) => {
        const {clearable = false} = args

        const arr: React.ReactElement[] = [];

        for (let i = 0; i < 100; i++) {
            arr.push(<MultiSelect.Option key={i}>{i}</MultiSelect.Option>)
        }

        return <MultiSelect  clearable={clearable} placeholder={"Select your items:"}>
            {arr}
        </MultiSelect>

    },
    args: {
        clearable: false
    }
}
