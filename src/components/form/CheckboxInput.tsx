import React, {RefObject} from "react";
import Input, {InputProps} from "./Input";


interface CheckboxInputProps extends Omit<InputProps<boolean | null>, "wrapperComponent" | "type" | "left" | "leftType"> {
    text?: string
}

const CheckboxInput: React.ForwardRefExoticComponent<CheckboxInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        text,
        value,
        initialValue,
        ...rest
    } = props


    return <Input
        wrapperComponent={{
            className: "checkbox-input"
        }}
        type={"checkbox"}
        right={text}
        left={null}
        ref={ref}
        value={value}
        {...(!!initialValue ? {defaultChecked: true} : {})}
        {...rest}
    />

})

export default CheckboxInput