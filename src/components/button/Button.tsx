import "./Button.style.scss"
import React, {
    ReactNode
} from "react";
import {mergeCode0Props} from "../../utils/utils";
import {Code0Component, Color} from "../../utils/types"

export interface ButtonProps extends Code0Component<HTMLButtonElement> {
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

const Button: React.FC<ButtonProps> = React.forwardRef((props, ref) => {

    const {children, variant = "normal", color = "secondary", active = false, disabled = false, ...args} = props

    return <button ref={ref} {...mergeCode0Props(`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} button--${variant}`, args)}
              aria-disabled={disabled ? "true" : "false"}>
        {children}
    </button>
})



export default Object.assign(Button);