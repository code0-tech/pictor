import React from "react";

export interface InputLabelProps {
    children: React.ReactNode | React.ReactElement
}

export const InputLabel: React.FC<InputLabelProps> = (props) => {

    const {children} = props

    return <label className={"input__label"}>
        {children}
    </label>

}