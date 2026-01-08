import {InputProps, Input} from "../form";
import React, {RefObject} from "react";
import {Button} from "../button/Button";
import {IconX} from "@tabler/icons-react";
import "./DFlowSuggestionSearchInput.style.scss"
import {clearInputElement} from "../form/Input.utils";

interface DFlowSuggestionSearchInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
}

export const DFlowSuggestionSearchInput: React.ForwardRefExoticComponent<DFlowSuggestionSearchInputProps> = React.forwardRef((props, ref: RefObject<HTMLElement>) => {
    ref = ref || React.useRef<HTMLElement>(null)

    const {
        clearable = false,
        right,
        ...rest
    } = props

    const toClearable = () => {
        clearInputElement(ref.current)
    }

    const rightAction = [right]
    clearable && rightAction.push(<Button variant={"none"} onClick={toClearable}><IconX size={13}/></Button>)


    return <Input
        wrapperComponent={{
            className: "d-flow-suggestion-search-input",
        }}
        right={rightAction}
        type={"text"}
        ref={ref as RefObject<HTMLInputElement>}
        {...rest}
    />
})
