import {Meta} from "@storybook/react";
import React from "react";
import Popover from "./Popover";
import Button from "../button/Button";

const meta: Meta = {
    title: "Popover",
    component: Popover
}

export default meta;

export const PopoverTest = () => {
    return <Popover placement={"left top"}>
        <Button>dsddsdsds</Button>
    </Popover>

}