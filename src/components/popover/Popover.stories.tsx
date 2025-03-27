import {Meta} from "@storybook/react";
import React from "react";
import Popover, {PopoverAnchor, PopoverArrow, PopoverBody, PopoverTrigger} from "./Popover";
import Button from "../button/Button";
import Text from "../text/Text";
import ButtonGroup from "../button-group/ButtonGroup";

const meta: Meta = {
    title: "Popover",
    component: Popover
}

export default meta

export const PopoverExample = () => {
    return <Popover defaultOpen placement="top-start">
        <PopoverTrigger>
            <Button variant="outlined" color={"secondary"}>Open Popover</Button>
        </PopoverTrigger>
        <PopoverBody>
            <PopoverArrow/>
            <Text>Lorem ipsum dolor sit amet, <br/> consetetur sadipscing elitr, sed diam<br/> nonumy eirmod tempor
                invidunt ut <br/>labore et dolore magna aliquyam</Text>
        </PopoverBody>
    </Popover>
}

export const PopoverAnchorExample = () => {
    return <Popover>
        <PopoverTrigger>
            <ButtonGroup>
                <Button variant="primary">Test1</Button>
                <Button variant="primary">Test2</Button>
                <PopoverAnchor>
                    <Button variant="primary">Test3</Button>
                </PopoverAnchor>
            </ButtonGroup>
        </PopoverTrigger>
        <PopoverBody>
            <PopoverArrow/>
            <Text>Lorem ipsum dolor sit amet, <br/> consetetur sadipscing elitr, sed diam<br/> nonumy eirmod tempor
                invidunt ut <br/>labore et dolore magna aliquyam</Text>
        </PopoverBody>
    </Popover>
}