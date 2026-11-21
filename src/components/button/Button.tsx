import "./Button.style.scss"
import React, {ReactNode} from "react";
import {Component, Sizes, Color, mergeComponentProps} from "../../utils";

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
    paddingSize?: Sizes
}

export const Button: React.FC<ButtonProps> = React.forwardRef((props, ref) => {

    const {
        children,
        variant = "normal",
        color = "secondary",
        paddingSize = "xs",
        active = false,
        disabled = false,
        type = "button",
        ...args
    } = props

    return <button
        ref={ref}
        {...mergeComponentProps(`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} button--${variant} button--${paddingSize}`, args)}
        //applied after the spread: a disabled button must never be given a submit
        //type that still works
        type={type as "button" | "reset" | "submit"}
        disabled={disabled}
        aria-disabled={disabled ? "true" : "false"}>
        {children}
    </button>
})
