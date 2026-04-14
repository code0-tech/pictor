import "./Button.style.scss"
import React, {ReactNode} from "react";
import {Component, Code0Sizes, Color, mergeComponentProps} from "../../utils";

export interface ButtonProps extends Component<HTMLButtonElement> {
    children: ReactNode | ReactNode[]
    //defaults to primary
    color?: Color,
    //default to normal
    variant?: "none" | "normal" | "outlined" | "filled",
    //defaults to false
    active?: boolean
    //defaults to false
    disabled?: boolean
    paddingSize?: Code0Sizes
}

export const Button: React.FC<ButtonProps> = React.forwardRef((props, ref) => {

    const {
        children,
        variant = "normal",
        color = "secondary",
        paddingSize = "xs",
        active = false,
        disabled = false,
        ...args
    } = props

    return <button
        ref={ref} {...mergeComponentProps(`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} button--${variant} button--${paddingSize}`, args)}
        aria-disabled={disabled ? "true" : "false"}>
        {children}
    </button>
})