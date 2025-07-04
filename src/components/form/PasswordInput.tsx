import React, {RefObject} from "react";
import Input, {InputProps, setElementKey} from "./Input";
import {IconEye, IconX} from "@tabler/icons-react";
import Button from "../button/Button";

interface PasswordInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    clearable?: boolean,
    visible?: boolean
}


const PasswordInput: React.ForwardRefExoticComponent<PasswordInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        clearable = true,
        visible = true,
        right,
        ...rest
    } = props

    const toClearable = () => {
        if (ref.current) setElementKey(ref.current, "value", "", "change")
    }

    const toVisible = () => {
        if (ref.current && ref.current.type == "password") ref.current.type = "text"
        else if (ref.current && ref.current.type == "text") ref.current.type = "password"
    }

    const rightAction = [right]
    visible && rightAction.push(<Button variant={"none"} onClick={toVisible}><IconEye size={13}/></Button>)
    clearable && rightAction.push(<Button variant={"outlined"} color={"error"} onClick={toClearable}><IconX size={13}/></Button>)


    return <Input
        right={rightAction}
        rightType={"action"}
        type={"password"}
        ref={ref}
        {...rest}
    />

})

export default PasswordInput