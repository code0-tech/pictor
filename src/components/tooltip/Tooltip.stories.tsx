import {Meta} from "@storybook/react";
import Tooltip from "./Tooltip";
import Button from "../button/Button";
import React from "react";

const meta: Meta = {
    title: "Tooltip"
}

export const TooltipExample = () => {
    return <>
        <Tooltip position={"top"}>
            <Tooltip.Trigger>
                <Button>
                    Test
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Menu>
                Test 2
            </Tooltip.Menu>
        </Tooltip>
        <Tooltip position={"left"}>
            <Tooltip.Trigger>
                <Button>
                    Test
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Menu>
                Test 2
            </Tooltip.Menu>
        </Tooltip>
        <Tooltip position={"bottom"}>
            <Tooltip.Trigger>
                <Button>
                    Test
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Menu>
                Test 2
            </Tooltip.Menu>
        </Tooltip>
        <Tooltip position={"right"}>
            <Tooltip.Trigger>
                <Button>
                    Test
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Menu>
                Test 2
            </Tooltip.Menu>
        </Tooltip>
    </>
}

export default meta