import React from "react";
import {ButtonProps} from "../button/Button";
import {mergeCode0Props} from "../../utils";
import "./GradientButton.style.scss"

export interface GradientButtonProps extends ButtonProps {

}

export const GradientButton: React.FC<GradientButtonProps> = (props) => {
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
        {...mergeCode0Props(`gradient-button gradient-button--${color} ${active ? "gradient-button--active" : ""} ${disabled ? "gradient-button--disabled" : ""} gradient-button--${variant} gradient-button--${paddingSize}`, args)}
        aria-disabled={disabled ? "true" : "false"}>
        {children}
    </button>
}