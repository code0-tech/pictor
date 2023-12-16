import "./Button.style.scss"
import React, {
    AnchorHTMLAttributes,
    DetailedHTMLProps,
    ReactNode
} from "react";

export interface ButtonType extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    children: ReactNode | ReactNode[]
    //defaults to primary
    variant?: "primary" | "secondary" | "info" | "success" | "warning" | "error",
    //defaults to false
    active?: boolean
}

export interface ButtonIconType {
    children: ReactNode
}

const Button: React.FC<ButtonType> = (props) => {

    const {children, variant = "primary", active = false, ...args} = props
    const icon = getChild(children, ButtonIcon)
    const content = getContent(children, ButtonIcon)


    return <a {...args} className={`button button--${variant} ${active ? "button--active" : ""}`}>
        {icon}
        {content ? <span className={"button__content"}>{content}</span> : null}
    </a>
}

const ButtonIcon: React.FC<ButtonIconType> = ({children}) => {
    return <span className={"button__icon"}>
        {children}
    </span>
}


const getChild = (children: ReactNode | ReactNode[], child: React.FC<any>): ReactNode | null => {
    return React.Children.toArray(children).find((childT) => {
        if (!React.isValidElement(childT)) return false;
        return childT.type == child;
    })
}

const getContent = (children: ReactNode | ReactNode[], ...child: React.FC<any>[]): ReactNode[] | null => {

    const array = React.Children.toArray(children).filter((childT) => {
        if (!React.isValidElement(childT)) return true;
        return !child.find(value => value == childT.type);
    })

    return array.length == 0 ? null : array
}

export default Object.assign(Button, {
    Icon: ButtonIcon
});