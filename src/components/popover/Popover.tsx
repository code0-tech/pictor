import React, {useRef} from "react";
import {AriaPopoverProps, Overlay, useButton, useOverlayTrigger, usePopover} from "react-aria";
import {useOverlayTriggerState} from "react-stately";

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
    children: React.ReactElement
}

const Popover: React.FC<PopoverProps> = (props) => {

    const {children, offset = 8, placement = "bottom start", ...args} = props
    const triggerRef = React.useRef(null)
    const popoverRef = useRef(null)
    const state = useOverlayTriggerState({})

    const {triggerProps, overlayProps} = useOverlayTrigger(
        {type: 'dialog'},
        state,
        triggerRef
    )
    const {popoverProps, underlayProps} = usePopover({
        placement,
        offset,
        triggerRef,
        popoverRef
    }, state);

    let { buttonProps } = useButton(triggerProps, triggerRef);


    const popoverContent = <span style={{color: "white"}}>dsd</span>


    return (
        <>
            <div ref={triggerRef}>
                {React.cloneElement(children, buttonProps)}
            </div>
            {state.isOpen &&
                (
                    <Overlay>
                        <div {...underlayProps} className="underlay"/>
                        <div
                            {...popoverProps}
                            ref={popoverRef}
                            className="popover"
                        >
                            {React.cloneElement(popoverContent, overlayProps)}
                        </div>
                    </Overlay>
                )}
        </>
    );

}


export default Object.assign(Popover)