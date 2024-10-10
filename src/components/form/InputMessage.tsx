import React from "react";
import {IconExclamationCircle} from "@tabler/icons-react";

export interface InputMessageProps {
    children: string
}

const InputMessage: React.FC<InputMessageProps> = (props) => {

    const {children} = props

    return <span className={"input__message"}>
        <IconExclamationCircle/>
        {children}
    </span>

}

export default InputMessage