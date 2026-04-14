import React from "react";
import {Color, ComponentProps, mergeComponentProps} from "../../utils";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import "./Tooltip.style.scss"

export type TooltipProps = ComponentProps & RadixTooltip.TooltipProps
export type TooltipTriggerProps = ComponentProps & RadixTooltip.TooltipTriggerProps
export type TooltipPortalProps = ComponentProps & RadixTooltip.TooltipPortalProps
export type TooltipContentProps = ComponentProps & RadixTooltip.TooltipContentProps & { color?: Color }
export type TooltipArrowProps = ComponentProps & RadixTooltip.TooltipArrowProps & { color?: Color }

export const Tooltip: React.FC<TooltipProps> = (props) => {
    return <RadixTooltip.TooltipProvider delayDuration={0}>
        <RadixTooltip.Tooltip {...mergeComponentProps(`tooltip`, props) as TooltipProps}/>
    </RadixTooltip.TooltipProvider>
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = (props) => {
    return <RadixTooltip.TooltipTrigger {...mergeComponentProps("tooltip__trigger", props) as TooltipTriggerProps}/>
}

export const TooltipPortal: React.FC<TooltipPortalProps> = (props) => {
    return <RadixTooltip.TooltipPortal {...mergeComponentProps("tooltip__portal", props) as TooltipPortalProps}/>
}

export const TooltipContent: React.FC<TooltipContentProps> = (props) => {
    return <RadixTooltip.TooltipContent
        align={props.align} {...mergeComponentProps(`tooltip__content tooltip__content--${props.color ?? "tertiary"}`, props) as TooltipContentProps}/>
}

export const TooltipArrow: React.FC<TooltipArrowProps> = (props) => {
    return <RadixTooltip.TooltipArrow {...mergeComponentProps(`tooltip__arrow tooltip__arrow--${props.color ?? "tertiary"}}`, props) as TooltipArrowProps}/>
}