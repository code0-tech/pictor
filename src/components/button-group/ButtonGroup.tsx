import React, {ReactElement} from "react";
import {ButtonType} from "../button/Button";
import "./ButtonGroup.style.scss"

export interface ButtonGroupType {
    children: ReactElement<ButtonType>[]
}

const ButtonGroup: React.FC<ButtonGroupType> = (props) => {

    const {children} = props

    return <div className={"button-group"}>

        {children.map((child, i) => {
            return <div
                className={`${i == 0 || i == children.length - 1 ? i == 0 ? "button-group__first" : "button-group__last" : "button-group__item"}`}>
                {child}
            </div>
        })}
    </div>
}

export default ButtonGroup;