import {Meta} from "@storybook/react";
import React from "react";
import {
    Menu,
    MenuContent, MenuGroup,
    MenuItem, MenuLabel,
    MenuPortal,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger
} from "./Menu";
import {Button} from "../button/Button";
import {IconChevronRight, IconStar, IconUserCircle} from "@tabler/icons-react";
import {Flex} from "../flex/Flex";

const meta: Meta = {
    title: "Menu"
}

export default meta

export const ExampleMenu = () => {

    return <Menu>
        <MenuTrigger asChild>
            <Button>Open Menu</Button>
        </MenuTrigger>
        <MenuPortal >
            <MenuContent side={"bottom"} align={"start"} sideOffset={5.6}>
                <MenuLabel>Label</MenuLabel>
                <MenuGroup>
                    <MenuItem> New Liquid <br/> Glass Design</MenuItem>
                    <MenuItem><IconUserCircle size={16}/> New Liquid <br/> Glass Design</MenuItem>
                    <MenuItem><IconUserCircle size={16}/> New Liquid <br/> Glass Design</MenuItem>
                </MenuGroup>

                <MenuSeparator/>
                <MenuItem disabled><IconStar size={16}/>UI Designer</MenuItem>
                <MenuSeparator/>
                <MenuSub>
                    <MenuSubTrigger>
                        <Flex justify={"space-between"} align={"center"} w={"100%"}>
                            Dribbble <IconChevronRight size={16}/>
                        </Flex>
                    </MenuSubTrigger>
                    <MenuPortal>
                        <MenuSubContent>
                            <MenuItem><IconUserCircle size={16}/> New Liquid <br/> Glass Design</MenuItem>
                            <MenuSeparator/>
                            <MenuItem disabled><IconStar size={16}/>UI Designer</MenuItem>
                        </MenuSubContent>
                    </MenuPortal>

                </MenuSub>
            </MenuContent>
        </MenuPortal>
    </Menu>

}