import MultiSelect from "./MultiSelect";
import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Badge from "../badge/Badge";


const meta: Meta = {
    title: "MultiSelect",
    component: MultiSelect,
    argTypes: {
        clearable: {
            type: "boolean"
        },
        placement: {
            options: ['left start', 'left end', 'bottom start', 'bottom end', 'top start', 'top end', 'right start', 'right end'],
            control: {type: 'radio'},
        },
        placeholder: {
            type: "string"
        },
        disabled: {
            type: "boolean"
        },
        disallowDeselection: {
            type: "boolean"
        }
    }
}


export default meta;

type MenuStory = StoryObj<typeof MultiSelect>

export const BasicMultiSelect: MenuStory = {
    render: (args) => {
        const {clearable = false, placement, placeholder, disabled, disallowDeselection} = args

        const arr: React.ReactElement[] = [];

        for (let i = 0; i < 100; i++) {
            arr.push(<MultiSelect.Option key={i}>{i}</MultiSelect.Option>)
        }

        return <div style={{width: "300px"}}>
            <MultiSelect disabled={disabled} disallowDeselection={disallowDeselection} placement={placement}
                         clearable={clearable} placeholder={placeholder}>
                {arr}
            </MultiSelect>
        </div>

    },
    args: {
        clearable: false,
        placement: "bottom start",
        placeholder: "Placeholder",
        disabled: false,
        disallowDeselection: false
    }
}

export const TestStory = () => {
    return <div style={{width: "300px"}}>
        <MultiSelect placement={"bottom start"} placeholder={"sddssdsd"}>
           <MultiSelect.Option key={"test"}>
               <Badge>Test</Badge>
               sdss
           </MultiSelect.Option>
        </MultiSelect>
    </div>
}
