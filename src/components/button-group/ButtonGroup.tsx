import React, {ReactElement} from "react";
import {ButtonProps} from "../button/Button";
import "./ButtonGroup.style.scss"
import {Component, Color, mergeComponentProps} from "../../utils";

export interface ButtonGroupType extends Component<HTMLDivElement> {
    children: ReactElement<ButtonProps> | ReactElement<ButtonProps>[]
    color?: Color
}

export const ButtonGroup: React.FC<ButtonGroupType> = (props) => {

    const {children, color = "secondary", ...args} = props

    const validChildren = React.Children.toArray(children).filter(child => child != null)
    const count = validChildren.length

    return <div {...mergeComponentProps(`button-group button-group--${color}`, args)}>

        {validChildren.map((child, i) => {

            let className = "button-group__item"
            if (i === count - 1) {
                className = "button-group__last"
            } else if (i === 0) {
                className = "button-group__first"
            }

            return <div
                key={`button-group-${i}`}
                className={className}>
                {child}
            </div>
        })}
    </div>
}
