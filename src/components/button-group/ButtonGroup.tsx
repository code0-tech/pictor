import React, {ReactElement} from "react";
import {ButtonProps} from "../button/Button";
import "./ButtonGroup.style.scss"
import {Component, Color, mergeComponentProps} from "../../utils";

export interface ButtonGroupType extends Component<HTMLDivElement> {
    children: ReactElement<ButtonProps>[]
    color?: Color
}

export const ButtonGroup: React.FC<ButtonGroupType> = (props) => {

    const {children, color = "secondary", ...args} = props

    return <div {...mergeComponentProps(`button-group button-group--${color}`, args)}>

        {children.map((child, i) => {
            return <div
                key={child.key ?? `button-group-${i}`}
                className={`${i == 0 || i == children.length - 1 ? i == 0 ? "button-group__first" : "button-group__last" : "button-group__item"}`}>
                {child}
            </div>
        })}
    </div>
}
