import React from "react";
import {IconX} from "@tabler/icons-react";

export interface InputMessageProps {
    children: string
}

export const InputMessage: React.FC<InputMessageProps> = (props) => {

    const {children} = props

    return <span className={"input__message"}>
        <IconX size={16} color={"#D90429"}/>
        {children}
    </span>

}