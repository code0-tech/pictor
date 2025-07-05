import React, {RefObject} from "react";
import Input, {InputProps, setElementKey} from "./Input";
import {IconX} from "@tabler/icons-react";
import Button from "../button/Button";


interface TextInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
}

const TextInput: React.ForwardRefExoticComponent<TextInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

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
    clearable && rightAction.push(<Button variant={"none"} onClick={toClearable}><IconX size={13}/></Button>)


    return <Input
        right={rightAction}
        type={"text"}
        ref={ref}
        {...rest}
    />

})

export default TextInput