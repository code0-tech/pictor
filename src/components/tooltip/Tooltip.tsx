import React from "react";
import {
    Color,
    ComponentProps,
    mergeComponentProps,
    popperTransformOrigin,
    useObservedOpen,
    usePopperMotion
} from "../../utils";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import "./Tooltip.style.scss"
import {AutoScrollArea} from "../scroll-area/ScrollArea";
import {AnimatePresence, motion} from "motion/react";

export type TooltipProps = ComponentProps & RadixTooltip.TooltipProps
export type TooltipTriggerProps = ComponentProps & RadixTooltip.TooltipTriggerProps
export type TooltipPortalProps = ComponentProps & RadixTooltip.TooltipPortalProps
export type TooltipContentProps = ComponentProps & RadixTooltip.TooltipContentProps & { color?: Color }
export type TooltipArrowProps = ComponentProps & RadixTooltip.TooltipArrowProps & { color?: Color }

//the content is force mounted and kept alive by AnimatePresence while it
//animates out, so the open state has to be known one level above it
const TooltipOpenContext = React.createContext(false)

export const Tooltip: React.FC<TooltipProps> = (props) => {
    const [open, onOpenChange] = useObservedOpen(props.open, props.defaultOpen, props.onOpenChange)

    return <RadixTooltip.TooltipProvider delayDuration={0}>
        <TooltipOpenContext.Provider value={open}>
            <RadixTooltip.Tooltip {...mergeComponentProps(`tooltip`, props) as TooltipProps} onOpenChange={onOpenChange}/>
        </TooltipOpenContext.Provider>
    </RadixTooltip.TooltipProvider>
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = (props) => {
    return <RadixTooltip.TooltipTrigger {...mergeComponentProps("tooltip__trigger", props) as TooltipTriggerProps}/>
}

export const TooltipPortal: React.FC<TooltipPortalProps> = (props) => {
    //force mounted so the portal outlives the tooltip's exit animation
    return <RadixTooltip.TooltipPortal forceMount {...mergeComponentProps("tooltip__portal", props) as TooltipPortalProps}/>
}

export const TooltipContent: React.FC<TooltipContentProps> = (props) => {
    const {children, ...rest} = props
    const open = React.useContext(TooltipOpenContext)
    //already open on mount means the user did not open it, so it does not animate in
    const openOnMount = React.useRef(open)
    const motionProps = usePopperMotion()

    return <AnimatePresence initial={!openOnMount.current}>
        {open && <RadixTooltip.TooltipContent
            key={"tooltip__content"}
            forceMount
            asChild
            align={props.align} {...mergeComponentProps(`tooltip__content tooltip__content--${props.color ?? "tertiary"}`, rest) as TooltipContentProps}>
            <motion.div {...motionProps} style={popperTransformOrigin("tooltip")}>
                <AutoScrollArea>
                    <div className={"tooltip__content-inner"}>
                        {children}
                    </div>
                </AutoScrollArea>
            </motion.div>
        </RadixTooltip.TooltipContent>}
    </AnimatePresence>
}

export const TooltipArrow: React.FC<TooltipArrowProps> = (props) => {
    return <RadixTooltip.TooltipArrow {...mergeComponentProps(`tooltip__arrow tooltip__arrow--${props.color ?? "tertiary"}}`, props) as TooltipArrowProps}/>
}