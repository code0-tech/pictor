import React, {RefObject} from "react";
import Input, {InputProps} from "./Input";
import ButtonGroup from "../button-group/ButtonGroup";
import {IconEye, IconX} from "@tabler/icons-react";
import Button from "../button/Button";

interface PasswordInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "right" | "rightType" | "type"> {
    clearable?: boolean,
    visible?: boolean
}


const PasswordInput: React.ForwardRefExoticComponent<PasswordInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    const {
        clearable = true,
        visible = true,
        ...rest
    } = props

    const toClearable = () => {
        if (ref.current) ref.current.value = ""
    }

    const toVisible = () => {
        if (ref.current && ref.current.type == "password") ref.current.type = "text"
        else if (ref.current && ref.current.type == "text") ref.current.type = "password"
    }

    const rightAction = clearable && visible ? <ButtonGroup>
        <Button onClick={toVisible}><IconEye size={13}/></Button>
        <Button onClick={toClearable}><IconX size={13}/></Button>
    </ButtonGroup> : clearable || visible ? <Button onClick={clearable ? toClearable : toVisible}>{clearable ? <IconX size={13}/> : <IconEye size={13}/>}</Button> : <></>

    return <Input
        right={rightAction}
        rightType={"action"}
        type={"password"}
        ref={ref}
        {...rest}
    />

})

export default PasswordInput