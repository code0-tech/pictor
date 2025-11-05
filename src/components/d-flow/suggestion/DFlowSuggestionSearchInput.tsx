import {InputProps, Input, setElementKey} from "../../form/Input";
import React, {RefObject} from "react";
import {Button} from "../../button/Button";
import {IconX} from "@tabler/icons-react";
import "./DFlowSuggestionSearchInput.style.scss"

interface DFlowSuggestionSearchInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    //defaults to false
    clearable?: boolean
}

export const DFlowSuggestionSearchInput: React.ForwardRefExoticComponent<DFlowSuggestionSearchInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {
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
        wrapperComponent={{
            className: "d-flow-suggestion-search-input",
        }}
        right={rightAction}
        type={"text"}
        ref={ref}
        {...rest}
    />
})