import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconX} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {setElementKey} from "./Input.utils";

/**
 * This regex is based on the validation behind the type="email" validation of html.
 * This can be used as the validation for email input
 */
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

interface EmailInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
}

export const emailValidation = (email: string) => EMAIL_REGEX.test(email)

export const EmailInput: React.ForwardRefExoticComponent<EmailInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        clearable = false,
        right,
        ...rest
    } = props

    const toClearable = () => {
        if (ref.current) setElementKey(ref.current, "value", "", "change")
    }

    const rightAction = [right]
    clearable && rightAction.push(<Button onClick={toClearable}><IconX size={13}/></Button>)


    return <Input
        right={rightAction}
        type={"email"}
        ref={ref}
        {...rest}
    />

})