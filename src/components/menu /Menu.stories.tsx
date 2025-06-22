import {Meta} from "@storybook/react";
import React from "react";
import Menu, {MenuBody, MenuItem, MenuSeparator, MenuTrigger, MenuTriggerArrow} from "./Menu";
import Button from "../button/Button";
import {
    IconCheck,
    IconStar,
    IconUserCircle,
} from "@tabler/icons-react";

const meta: Meta = {
    title: "Menu",
    component: Menu
}

export default meta

export const MenuExample = () => {

    return <Menu placement={"bottom-start"}>
        <MenuTrigger>
            <Button variant="outlined" color="primary">
                Menu
                <MenuTriggerArrow/>
            </Button>
        </MenuTrigger>
        <MenuBody gutter={8}>
            <MenuItem><IconUserCircle size={16}/> New Liquid <br/> Glass Design</MenuItem>
            <MenuSeparator/>
            <MenuItem><IconStar size={16}/>UI Designer</MenuItem>
            <MenuSeparator/>
            <MenuItem><IconCheck size={16}/>Dribbble</MenuItem>
        </MenuBody>
    </Menu>

}