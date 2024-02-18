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


        const arr: React.ReactElement[] = [];

        for (let i = 0; i < 100; i++) {
            arr.push(<MultiSelect.Option key={i}>{i}</MultiSelect.Option>)
        }

        return <MultiSelect placeholder={"Select your items 123123123123123asd"}>
            {arr}
        </MultiSelect>

    }
}
