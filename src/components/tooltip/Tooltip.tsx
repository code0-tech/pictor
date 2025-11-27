import React from "react";
import {Code0ComponentProps} from "../../utils/types";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import {mergeCode0Props} from "../../utils/utils";
import "./Tooltip.style.scss"

export type TooltipProps = Code0ComponentProps & RadixTooltip.TooltipProps
export type TooltipTriggerProps = Code0ComponentProps & RadixTooltip.TooltipTriggerProps
export type TooltipPortalProps = Code0ComponentProps & RadixTooltip.TooltipPortalProps
export type TooltipContentProps = Code0ComponentProps & RadixTooltip.TooltipContentProps
export type TooltipArrowProps = Code0ComponentProps & RadixTooltip.TooltipArrowProps

export const Tooltip: React.FC<TooltipProps> = (props) => {
    return <RadixTooltip.TooltipProvider delayDuration={0}>
        <RadixTooltip.Tooltip {...mergeCode0Props("tooltip", props) as TooltipProps}/>
    </RadixTooltip.TooltipProvider>
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = (props) => {
    return <RadixTooltip.TooltipTrigger {...mergeCode0Props("tooltip__trigger", props) as TooltipTriggerProps}/>
}

export const TooltipPortal: React.FC<TooltipPortalProps> = (props) => {
    return <RadixTooltip.TooltipPortal {...mergeCode0Props("tooltip__portal", props) as TooltipPortalProps}/>
}

export const TooltipContent: React.FC<TooltipContentProps> = (props) => {
    return <RadixTooltip.TooltipContent
        align={props.align} {...mergeCode0Props("tooltip__content", props) as TooltipContentProps}/>
}

export const TooltipArrow: React.FC<TooltipArrowProps> = (props) => {
    return <RadixTooltip.TooltipArrow {...mergeCode0Props("tooltip__arrow", props) as TooltipArrowProps}/>
}