import {Meta} from "@storybook/react";
import React from "react";
import Dropdown from "./Dropdown";
import Button from "../button/Button";
import {IconAbc} from "@tabler/icons-react";
import ButtonGroup from "../button-group/ButtonGroup";

const meta: Meta = {
    title: "Dropdown",
    component: Dropdown
}

export default meta;

export const Dropdowns = () => {
    return <>
        <Dropdown position={"bottom"} align={"start"}>
            <Dropdown.Trigger>
                <Button>Open Dropdown</Button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            </Dropdown.Menu>
        </Dropdown>


        <Dropdown position={"top"} align={"center"}>
            <Dropdown.Trigger>
                <Button>Open Dropdown</Button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                <Dropdown.Group>
                    <Dropdown.Group.Item>
                        Item 1
                    </Dropdown.Group.Item>
                    <Dropdown.Group.Item>
                        Item 2
                    </Dropdown.Group.Item>
                </Dropdown.Group>
                <Dropdown.Footer>
                    That's the footer
                </Dropdown.Footer>
            </Dropdown.Menu>
        </Dropdown>

        <ButtonGroup>
            {
                ["secondary", "secondary", "secondary", "secondary"].map((value, index) => {
                    // @ts-ignore
                    return (index % 2 == 0) ? <Button disabled={(index % 2) == 0} color={value}>
                        {(index % 2) == 0 ? <IconAbc/> : null}
                        {value}
                    </Button> : <Dropdown position={"bottom"} align={"start"}>
                        <Dropdown.Trigger>
                            <Button disabled={(index % 2) == 0} color={"secondary"}>
                                {(index % 2) == 0 ? <IconAbc/> : null}
                                {value}
                            </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Menu>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                        </Dropdown.Menu>
                    </Dropdown>
                })
            }
        </ButtonGroup>
    </>
}