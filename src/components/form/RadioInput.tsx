import React, {RefObject} from "react";
import Input, {InputProps} from "./Input";


interface RadioInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "leftType"> {
    text?: string
}

const RadioInput: React.ForwardRefExoticComponent<RadioInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        text,
        value,
        defaultValue,
        ...rest
    } = props


    return <Input
        wrapperComponent={{
            className: "radio-input"
        }}
        type={"radio"}
        right={text}
        left={null}
        ref={ref}
        value={value}
        {...(value === defaultValue ? {defaultChecked: true} : {})}
        {...rest}
    />

})

export default RadioInput