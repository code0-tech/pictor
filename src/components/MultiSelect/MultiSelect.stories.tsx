import MultiSelect from "./MultiSelect";
import {Meta, StoryObj} from "@storybook/react";
import React from "react";


const meta: Meta = {
    title: "MultiSelect",
    component: MultiSelect,
}


export default meta;

type MenuStory = StoryObj<typeof MultiSelect>

export const BasicMultiSelect: MenuStory = {
    render: (args) => {

        return <MultiSelect placeholder={"Select your items"}>
            <MultiSelect.Option key={"1"}>Test (Key=1)</MultiSelect.Option>
            <MultiSelect.Option key={"2"}>Test 2 (Key=2)</MultiSelect.Option>
        </MultiSelect>

    }
}
