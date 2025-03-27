import React from "react";
import {
    //props
    PopoverProviderProps as AKPopoverProviderProps,
    PopoverAnchorProps as AKPopoverAnchorProps,
    PopoverDisclosureProps as AKPopoverDisclosureProps,
    PopoverProps as AKPopoverProps,
    PopoverArrowProps as AKPopoverArrowProps,
    //component
    PopoverProvider as AKPopoverProvider,
    PopoverAnchor as AKPopoverAnchor,
    PopoverDisclosure as AKPopoverDisclosure,
    Popover as AKPopover,
    PopoverArrow as AKPopoverArrow
} from "@ariakit/react"
import {Code0ComponentProps} from "../../utils/types";
import "./Popover.style.scss"
import {mergeCode0Props} from "../../utils/utils";

type PopoverProps = AKPopoverProviderProps
type PopoverAnchorProps = Code0ComponentProps & AKPopoverAnchorProps
type PopoverTriggerProps = Code0ComponentProps & AKPopoverDisclosureProps & { children: React.ReactElement }
type PopoverBodyProps = Code0ComponentProps & AKPopoverProps
type PopoverArrowProps = Code0ComponentProps & AKPopoverArrowProps

const Popover: React.FC<PopoverProps> = (props) => <AKPopoverProvider {...props} />
export const PopoverAnchor: React.FC<PopoverAnchorProps> = (props) => <AKPopoverAnchor {...mergeCode0Props('', props)} />
export const PopoverTrigger: React.FC<PopoverTriggerProps> = (firstProps) => <AKPopoverDisclosure
    render={(props) => {
        return React.cloneElement(firstProps.children, props);
    }}/>
export const PopoverBody: React.FC<PopoverBodyProps> = (props) => <AKPopover {...{...mergeCode0Props('popover', props)}} />
export const PopoverArrow: React.FC<PopoverArrowProps> = (props) => <AKPopoverArrow {...mergeCode0Props('popover__arrow', props)} />

export default Popover