import React, {RefObject} from "react";
import Input, {InputProps} from "./Input";
import {IconX} from "@tabler/icons-react";
import Button from "../button/Button";

/**
 * This regex is based on the validation behind the type="email" validation of html.
 * This can be used as the validation for email input
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

interface EmailInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
}

export const emailValidation = (email: string) => EMAIL_REGEX.test(email)

const EmailInput: React.ForwardRefExoticComponent<EmailInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        clearable = false,
        right,
        ...rest
    } = props

    const toClearable = () => {
        if (ref.current) ref.current.value = ""
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

export default EmailInput