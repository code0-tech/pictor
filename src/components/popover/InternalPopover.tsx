import "./Popover.style.scss"
import React from "react";
import {AriaPopoverProps, Overlay, usePopover} from "react-aria";
import {OverlayTriggerState} from "react-stately";

interface InternalPopoverType extends Omit<AriaPopoverProps, 'popoverRef'> {
    children: React.ReactNode;
    state: OverlayTriggerState;
}

export const InternalPopover: React.FC<InternalPopoverType> = (props) => {

    const {children, state, offset = 8, ...args} = props
    const popoverRef = React.useRef(null);
    const {popoverProps} = usePopover({
        ...args,
        offset,
        popoverRef
    }, state);

    return (
        <Overlay>
            <div
                {...popoverProps}
                ref={popoverRef}
                className="popover__content"
            >
                {children}
            </div>
        </Overlay>
    );
}