import {Meta} from "@storybook/react";
import React from "react";
import Dropdown from "./Dropdown";
import Button from "../button/Button";
import {IconAbc, IconMail, IconSearch} from "@tabler/icons-react";
import ButtonGroup from "../button-group/ButtonGroup";
import Input from "../input/Input";

const meta: Meta = {
    title: "Dropdown",
    component: Dropdown
}

export default meta;

export const Test = () => {
    return <>
        <Dropdown position={"bottom"} align={"start"}>
            <Dropdown.Trigger>
                <Button>Open Dropdown</Button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                Loremss d sd sd s ds ds ds dsdsdsdsd sd Loremss d sd sd s ds ds ds dsdsdsdsd sd
            </Dropdown.Menu>
        </Dropdown>


        <Dropdown position={"bottom"} align={"start"}>
            <Dropdown.Trigger>
                <Button>Open Dropdown</Button>
            </Dropdown.Trigger>
            <Dropdown.Menu>
                <Dropdown.Header>
                    <Input.Control placeholder={"search..."}>
                        <Input.Control.Icon><IconSearch/></Input.Control.Icon>
                    </Input.Control>
                </Dropdown.Header>
                sds
            </Dropdown.Menu>
        </Dropdown>

        <ButtonGroup>
            {
                ["secondary", "secondary", "secondary", "secondary"].map((value, index) => {
                    // @ts-ignore
                    return (index % 2 == 0) ? <Button disabled={(index % 2) == 0} variant={value}>
                        {(index % 2) == 0 ? <Button.Icon><IconAbc/></Button.Icon> : null}
                        {value}
                    </Button> : <Dropdown position={"bottom"} align={"start"}>
                        <Dropdown.Trigger>
                            <Button disabled={(index % 2) == 0} variant={"secondary"}>
                                {(index % 2) == 0 ? <Button.Icon><IconAbc/></Button.Icon> : null}
                                {value}
                            </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Menu>
                            Loremss d sd sd s ds ds ds dsdsdsdsd sd Loremss d sd sd s ds ds ds dsdsdsdsd sd
                        </Dropdown.Menu>
                    </Dropdown>
                })
            }
        </ButtonGroup>
    </>
}