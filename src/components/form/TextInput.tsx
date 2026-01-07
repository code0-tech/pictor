import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconX} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {clearInputElement} from "./Input.utils";


export interface TextInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
    onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const TextInput: React.ForwardRefExoticComponent<TextInputProps> = React.forwardRef((props, ref: RefObject<HTMLElement>) => {

    ref = ref || React.useRef<HTMLElement>(null)

    const {
        clearable = false,
        right,
        ...rest
    } = props

    const toClearable = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearInputElement(ref.current)
        if (props.onClear) props.onClear(event)
    }

    const rightAction = [right]
    clearable && rightAction.push(<Button variant={"none"} onClick={(event) => toClearable(event)}><IconX size={13}/></Button>)


    return <Input
        right={rightAction}
        type={"text"}
        ref={ref as RefObject<HTMLInputElement>}
        {...rest}
    />

})
