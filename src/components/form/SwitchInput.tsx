import React, {RefObject} from "react";
import Input, {InputProps} from "./Input";


interface SwitchInputProps extends Omit<InputProps<boolean | null>, "wrapperComponent" | "type" | "left" | "leftType"> {

}

const SwitchInput: React.ForwardRefExoticComponent<SwitchInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        value,
        initialValue,
        ...rest
    } = props


    return <Input
        wrapperComponent={{
            className: "switch-input"
        }}
        type={"checkbox"}
        right={null}
        left={null}
        ref={ref}
        value={value}
        {...(!!initialValue ? {defaultChecked: true} : {})}
        {...rest}
    />

})

export default SwitchInput