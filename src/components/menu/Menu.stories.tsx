import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Button from "../button/Button";
import {Placement} from "react-aria";
import Menu from "./Menu";
import {Icon3dRotate, IconLogout, IconUserCancel, IconUserEdit} from "@tabler/icons-react";
import Badge from "../badge/Badge";

const meta: Meta = {
    title: "Menu",
    component: Menu,
    argTypes: {
        placement: {
            options: ['left start', 'left end', 'bottom start', 'bottom end', 'top start', 'top end', 'right start', 'right end'],
            control: {type: 'radio'},
        }
    }
}

export default meta;

type MenuStory = StoryObj<{ placement: Placement }>

export const MenuAccount: MenuStory = {
    render: (args) => {

        const {placement} = args

        return <>
            <Menu placement={placement} defaultOpen>
                <Menu.Trigger>
                    <Button>Click me</Button>
                </Menu.Trigger>
                <Menu.Content>
                    <Menu.Section>
                        <Menu.Item variant={"info"} unselectable key={"ssd"}>
                            Storage almost full. You can <br/>
                            manage your storage in Settings →
                        </Menu.Item>
                    </Menu.Section>
                    <Menu.Section title={"Account Settings"}>
                        <Menu.Item key={"update-account"}><Menu.Icon><IconUserEdit/></Menu.Icon> Update Account</Menu.Item>
                        <Menu.Item variant={"error"} key={"delete-account"}><Menu.Icon><IconUserCancel/></Menu.Icon> Delete Account</Menu.Item>
                    </Menu.Section>
                    <Menu.Item variant={"warning"} key="logout"><Menu.Icon><IconLogout/></Menu.Icon> Logout <Menu.Shortcut>⌘Q</Menu.Shortcut></Menu.Item>
                </Menu.Content>
            </Menu>

        </>
    }
}

export const MenuAccountList: MenuStory = {
    render: (args) => {

        const {placement} = args

        return <>
            <Menu placement={placement} defaultOpen selectionMode={"multiple"} defaultSelectedKeys={["raphael@goetz.de"]}>
                <Menu.Trigger>
                    <Button>Click me</Button>
                </Menu.Trigger>
                <Menu.Content>
                    {
                        [{
                            mail: "nico@sammito.de",
                            name: "Nico Sammito"
                        },{
                            mail: "niklas.van@schrick.de",
                            name: "Niklas van Schrick"
                        },{
                            mail: "raphael@goetz.de",
                            name: "Raphael Götz"
                        },{
                            mail: "maximillian@staedtler.de",
                            name: "Maximillian Städtler"
                        }].map(item => (
                            <Menu.Item key={item.mail}>{item.name} <Badge style={{marginLeft: ".5rem"}}>{item.mail}</Badge></Menu.Item>
                        ))
                    }
                </Menu.Content>
            </Menu>

        </>
    }
}