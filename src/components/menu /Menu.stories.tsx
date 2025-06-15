import {Meta} from "@storybook/react";
import React from "react";
import Menu, {MenuBody, MenuItem, MenuSeparator, MenuTrigger, MenuTriggerArrow} from "./Menu";
import Button from "../button/Button";
import {
    IconCheck,
    IconFolder,
    IconLicense,
    IconMenu,
    IconStar,
    IconUser,
    IconUserCircle,
    IconUserFilled
} from "@tabler/icons-react";

const meta: Meta = {
    title: "Menu",
    component: Menu
}

export default meta

export const MenuExample = () => {

    return <Menu defaultOpen placement={"right-end"}>
        <MenuTrigger>
            <Button variant="outlined" color="secondary">
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