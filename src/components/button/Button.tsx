import "./Button.style.scss"
import React, {ReactNode} from "react";
import {Code0Component, Code0Sizes, Color, mergeCode0Props} from "../../utils";

export interface ButtonProps extends Code0Component<HTMLButtonElement> {
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
        ref={ref} {...mergeCode0Props(`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} button--${variant} button--${paddingSize}`, args)}
        aria-disabled={disabled ? "true" : "false"}>
        {children}
    </button>
})