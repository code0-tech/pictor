import "./Button.style.scss"
import React, {
    AnchorHTMLAttributes,
    DetailedHTMLProps,
    ReactNode
} from "react";
import {getChild, getContent} from "../../utils/utils";

export interface ButtonType extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    children: ReactNode | ReactNode[]
    //defaults to primary
    color?: "primary" | "secondary" | "info" | "success" | "warning" | "error",
    //default to normal
    variant?: "none" | "normal" | "outlined" | "filled",
    //defaults to false
    active?: boolean
    //defaults to false
    disabled?: boolean
}

export interface ButtonIconType {
    children: ReactNode
}

const Button: React.FC<ButtonType> = (props) => {

    const {children, variant = "normal", color = "primary", active = false, disabled = false, ...args} = props
    const icon = getChild(children, ButtonIcon)
    const content = getContent(children, ButtonIcon)

    const variantWrapper = {
        none: "button__withoutAll",
        outlined: "button--outlined",
        filled: "button__withoutBackground"
    }

    return <a {...args}
              className={`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""} ${variantWrapper}`}
              aria-disabled={disabled ? "true" : "false"}>
        {icon}
        {content ? <span className={"button__content"}>{content}</span> : null}
    </a>
}

const ButtonIcon: React.FC<ButtonIconType> = ({children}) => {
    return <span className={"button__icon"}>
        {children}
    </span>
}

export default Object.assign(Button, {
    Icon: ButtonIcon
});