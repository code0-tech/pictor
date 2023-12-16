import React, {ReactElement} from "react";
import {ButtonType} from "../button/Button";
import "./ButtonGroup.style.scss"

export interface ButtonGroupType {
    children: ReactElement<ButtonType>[]
}

const ButtonGroup: React.FC<ButtonGroupType> = (props) => {

    const {children} = props

    return <div className={"button-group"}>
        {children}
    </div>
}

export default ButtonGroup;