import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconEye, IconX} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {setElementKey} from "./Input.utils";

interface PasswordInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    clearable?: boolean,
    visible?: boolean
}


export const PasswordInput: React.ForwardRefExoticComponent<PasswordInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        clearable = true,
        visible = true,
        right,
        ...rest
    } = props

    const toClearable = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ref.current) setElementKey(ref.current, "value", "", "change")
        event.stopPropagation()
        event.preventDefault()
        return false
    }

    const toVisible = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ref.current && ref.current.type == "password") ref.current.type = "text"
        else if (ref.current && ref.current.type == "text") ref.current.type = "password"
        event.stopPropagation()
        event.preventDefault()
        return false
    }

    const rightAction = [right]
    visible && rightAction.push(<Button variant={"none"} onClick={(event) => toVisible(event)}><IconEye size={13}/></Button>)
    clearable && rightAction.push(<Button variant={"none"} onClick={(event) => toClearable(event)}><IconX size={13}/></Button>)


    return <Input
        right={rightAction}
        rightType={"action"}
        type={"password"}
        ref={ref}
        {...rest}
    />

})