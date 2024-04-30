import "./Button.style.scss"
import React, {
    ReactNode
} from "react";
import {getChild, getContent, mergeCode0Props} from "../../utils/utils";
import {Code0Component, Color} from "../../utils/types"

export interface ButtonType extends Code0Component<HTMLAnchorElement> {
    children: ReactNode | ReactNode[]
    //defaults to primary
    color?: Color,
    //default to normal
    variant?: "none" | "normal" | "outlined" | "filled",
    //defaults to false
    active?: boolean
    //defaults to false
    disabled?: boolean
}

export interface ButtonIconType extends Code0Component<HTMLSpanElement>{
    children: ReactNode
}

const Button: React.FC<ButtonType> = (props) => {

    const {children, variant = "normal", color = "primary", active = false, disabled = false, ...args} = props
    const icon = getChild(children, ButtonIcon)
    const content = getContent(children, ButtonIcon)

    return <a {...mergeCode0Props(`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} button--${variant}`, args)}
              aria-disabled={disabled ? "true" : "false"}>
        {icon}
        {content ? <span className={"button__content"}>{content}</span> : null}
    </a>
}

const ButtonIcon: React.FC<ButtonIconType> = (props) => {

    const {children, ...args} = props
    return <span {...mergeCode0Props("button__icon", args)}>
        {children}
    </span>
}

export default Object.assign(Button, {
    Icon: ButtonIcon
});