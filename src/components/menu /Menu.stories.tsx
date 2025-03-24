import {Meta} from "@storybook/react";
import React from "react";
import Menu, {MenuBody, MenuItem, MenuSeparator, MenuTrigger, MenuTriggerArrow} from "./Menu";
import Button from "../button/Button";

const meta: Meta = {
    title: "Menu",
    component: Menu
}

export default meta

export const MenuExample = () => {

    return <Menu defaultOpen placement={"right-end"}>
        <MenuTrigger>
            <Button variant="secondary">
                Menu
                <MenuTriggerArrow/>
            </Button>
        </MenuTrigger>
        <MenuBody gutter={8}>
            <MenuItem>Einstellungen</MenuItem>
            <MenuItem>Lizenzen</MenuItem>
            <MenuItem>Projekte</MenuItem>
            <MenuSeparator/>
            <MenuItem>Mehr...</MenuItem>
        </MenuBody>
    </Menu>

}