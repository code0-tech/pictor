import React, {ReactElement} from "react";
import {ButtonProps} from "../button/Button";
import "./ButtonGroup.style.scss"
import {Code0Component} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface ButtonGroupType extends Code0Component<HTMLDivElement> {
    children: ReactElement<ButtonProps>[]
}

const ButtonGroup: React.FC<ButtonGroupType> = (props) => {

    const {children, ...args} = props

    return <div {...mergeCode0Props("button-group", args)}>

        {children.map((child, i) => {
            return <div
                className={`${i == 0 || i == children.length - 1 ? i == 0 ? "button-group__first" : "button-group__last" : "button-group__item"}`}>
                {child}
            </div>
        })}
    </div>
}

export default ButtonGroup;