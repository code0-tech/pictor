import {Meta} from "@storybook/react-vite";
import {Button} from "../button/Button";
import React from "react";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "./Tooltip";

export default {
    title: "Tooltip",
} as Meta


export const ExampleTooltip = () => {

    return <Tooltip>
        <TooltipTrigger asChild>
            <Button>
                Simple Button
            </Button>
        </TooltipTrigger>
        <TooltipPortal>
            <TooltipContent sideOffset={5.6}>
                Help
                <TooltipArrow/>
            </TooltipContent>
        </TooltipPortal>
    </Tooltip>

}