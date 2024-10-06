import "./Button.style.scss"
import React, {
    ReactNode
} from "react";
import {mergeCode0Props} from "../../utils/utils";
import {Code0Component, Color} from "../../utils/types"

export interface ButtonProps extends Code0Component<HTMLAnchorElement> {
    children: ReactNode | ReactNode[]
    //defaults to primary
    color?: Color,
    //default to normal
    variant?: "none" | "normal" | "outlined",
    //defaults to false
    active?: boolean
    //defaults to false
    disabled?: boolean
}

const Button: React.FC<ButtonProps> = (props) => {

    const {children, variant = "normal", color = "primary", active = false, disabled = false, ...args} = props

    return <a {...mergeCode0Props(`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} button--${variant}`, args)}
              aria-disabled={disabled ? "true" : "false"}>
        {children}
    </a>
}



export default Object.assign(Button);