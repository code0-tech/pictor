import "./Button.style.scss"
import React, {
    AnchorHTMLAttributes,
    DetailedHTMLProps,
    ReactNode
} from "react";
import {getChild, getContent, Color} from "../../utils/utils";

export interface ButtonType extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    children: ReactNode | ReactNode[]
    //defaults to primary
    color?: Color,
    //defaults to false
    active?: boolean
    //defaults to false
    disabled?: boolean
}

export interface ButtonIconType {
    children: ReactNode
}

const Button: React.FC<ButtonType> = (props) => {

    const {children, color = "primary", active = false, disabled = false, ...args} = props
    const icon = getChild(children, ButtonIcon)
    const content = getContent(children, ButtonIcon)


    return <a {...args} className={`button button--${color} ${active ? "button--active" : ""} ${disabled ? "button--disabled" : ""}`}
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