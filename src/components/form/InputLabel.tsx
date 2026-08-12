import React from "react";

export interface InputLabelProps {
    children: React.ReactNode | React.ReactElement
    htmlFor?: string
    id?: string
}

export const InputLabel: React.FC<InputLabelProps> = (props) => {

    const {children, htmlFor, id} = props

    return <label className={"input__label"} htmlFor={htmlFor} id={id}>
        {children}
    </label>

}