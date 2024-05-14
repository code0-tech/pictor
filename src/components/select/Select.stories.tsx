import {Meta} from "@storybook/react";
import React from "react";
import Select from "./Select";
import {SelectProvider} from "@ariakit/react";
import {Text} from "../../index";

const meta: Meta = {
    title: "Select"
}

export const BasicSelect = () => {
    return <SelectProvider defaultOpen>
        <Select/>
        <Select.Popover>
            <Text size={"md"}>
                Select whatever fruit you like <br/>
                and feel the vitamins
            </Text>
            <Select.Separator/>
            <Select.Group>
                <Select.GroupLabel>Fruits</Select.GroupLabel>
                <Select.Item value={"Apple"}/>
                <Select.Item value={"Banana"}/>
                <Select.Item disabled value={"Grape"}/>
                <Select.Item value={"Orange"}/>
            </Select.Group>

        </Select.Popover>
    </SelectProvider>
}

export default meta;
