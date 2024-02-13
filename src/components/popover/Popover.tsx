import React from "react";
import {useButton, useOverlayTrigger} from "react-aria";
import {useOverlayTriggerState} from "react-stately";
import {getChild} from "../../utils/utils";
import {OverlayTriggerProps, PositionProps} from "@react-types/overlays";
import {AriaButtonOptions} from "@react-aria/button";
import {InternalPopover} from "./InternalPopover";

export interface PopoverProps extends PositionProps, OverlayTriggerProps {
    children: React.ReactElement<PopoverTriggerType & PopoverContentType>[]
}

export interface PopoverTriggerType {
    children: React.ReactElement
}

export interface PopoverContentType {
    children: React.ReactNode
}

const Popover: React.FC<PopoverProps> = (props) => {

    const {children, ...args} = props

    //get trigger and content from popover
    const popoverTrigger = getChild(children, PopoverTrigger, true)
    const popoverContent = getChild(children, PopoverContent, true)

    //initial state for popover
    const state = useOverlayTriggerState({
        isOpen: props.isOpen,
        defaultOpen: props.defaultOpen,
        onOpenChange: props.onOpenChange
    })

    const triggerRef = React.useRef(null)

    const {triggerProps, overlayProps} = useOverlayTrigger(
        {type: "dialog"},
        state,
        triggerRef
    )


    const {buttonProps} = useButton(triggerProps as AriaButtonOptions<'div'>, triggerRef);


    return (
        <>
            <div ref={triggerRef} {...buttonProps}>
                {popoverTrigger?.props.children}
            </div>

            {state.isOpen && (
                <InternalPopover {...args} state={state} triggerRef={triggerRef}>
                    {popoverContent ? React.cloneElement(popoverContent, overlayProps) : null}
                </InternalPopover>
            )}
        </>
    );

}

const PopoverTrigger: React.FC<PopoverTriggerType> = (props) => {

    const {children, ...args} = props

    return <div {...args}>
        {children}
    </div>
}

const PopoverContent: React.FC<PopoverContentType> = (props) => {

    const {children, ...args} = props

    return <>
        {children}
    </>
}


export default Object.assign(Popover, {
    Trigger: PopoverTrigger,
    Content: PopoverContent
})