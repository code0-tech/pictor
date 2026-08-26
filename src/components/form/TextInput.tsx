import React, {ReactElement, RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconX} from "@tabler/icons-react";
import {Button, ButtonProps} from "../button/Button";
import {clearInputElement} from "./Input.utils";
import {ButtonGroup} from "../button-group/ButtonGroup";


export interface TextInputProps extends Omit<InputProps<string | null>, "type"> {
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

    const rightAction: ReactElement<ButtonProps>[] = [right as ReactElement<ButtonProps>]
    clearable && rightAction.push(<Button color={"secondary"} paddingSize={"xxs"} onClick={(event) => toClearable(event)}><IconX size={13}/></Button>)

    const rightActions = rightAction.filter(Boolean)


    return <Input
        right={rightActions.length > 0 ? <ButtonGroup color={"primary"}>
            {rightActions}
        </ButtonGroup> : undefined}
        type={"text"}
        ref={ref as RefObject<HTMLInputElement>}
        {...rest}
    />

})
