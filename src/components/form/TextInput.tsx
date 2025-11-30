import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconX} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {setElementKey} from "./Input.utils";


export interface TextInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
    onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const TextInput: React.ForwardRefExoticComponent<TextInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        clearable = false,
        right,
        ...rest
    } = props

    const toClearable = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ref.current) setElementKey(ref.current, "value", "", "change")
        if (props.onClear) props.onClear(event)
    }

    const rightAction = [right]
    clearable && rightAction.push(<Button variant={"none"} onClick={(event) => toClearable(event)}><IconX size={13}/></Button>)


    return <Input
        right={rightAction}
        type={"text"}
        ref={ref}
        {...rest}
    />

})