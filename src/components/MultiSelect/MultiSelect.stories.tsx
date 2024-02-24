import MultiSelect from "./MultiSelect";
import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Badge from "../badge/Badge";
import Card from "../card/Card";


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
        maxValues: {
            type: "number"
        }
    }
}


export default meta;

type MenuStory = StoryObj<typeof MultiSelect>

export const BasicMultiSelect: MenuStory = {
    render: (args) => {
        const {placement, placeholder, disabled, maxValues} = args

        const arr: React.ReactElement[] = [];

        for (let i = 0; i < 100; i++) {
            arr.push(<MultiSelect.Option key={i}>{i}</MultiSelect.Option>)
        }

        return <div style={{width: "300px"}}>
            <MultiSelect maxValues={maxValues} disabled={disabled}  placement={placement}
                         placeholder={placeholder}>
                {arr}
            </MultiSelect>
        </div>

    },
    args: {
        placement: "bottom start",
        placeholder: "Placeholder",
        disabled: false,
        maxValues: -1,
    }
}


export const CarSelection: MenuStory = {
    render: (args) => {
        const {placement, placeholder, disabled, maxValues} = args

        return <div style={{width: "300px"}}>
            <MultiSelect disabled={disabled} maxValues={maxValues} placement={placement}
                          placeholder={placeholder}>
                <MultiSelect.Option key={"Mercedes"}><Badge>Mercedes</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"BMW"}><Badge>BMW</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Toyota"}><Badge>Toyota</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Tesla"}><Badge>Tesla</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Jeep"}><Badge>Jeep</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Chevrolet"}><Badge>Chevrolet</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Honda"}><Badge>Honda</Badge></MultiSelect.Option>
                <MultiSelect.Option key={"Ford"}><Badge>Ford</Badge></MultiSelect.Option>
            </MultiSelect>
        </div>

    },
    args: {
        placement: "bottom start",
        placeholder: "Select your 2 favorite Car Brand",
        disabled: false,
        maxValues: 2
    }
}

