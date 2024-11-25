import React, {RefObject, useEffect} from "react";
import Input from "../Input";
import {Code0Component} from "../../../utils/types";
import {useRadioGroup} from "./RadioGroup";


interface RadioButtonProps extends Code0Component<HTMLInputElement> {
}

const RadioButton: React.ForwardRefExoticComponent<RadioButtonProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    const {value, ...rest} = props

    const radioGroup = useRadioGroup()
    ref = ref || React.useRef(null)

    //update store of radio group
    useEffect(() => {
        if (!ref || !ref.current || !radioGroup) return
        ref.current.addEventListener("change", ev => {
            radioGroup.setActiveRadio(String(value))
        })
    }, [ref, radioGroup])

    return <Input
        wrapperComponent={{
            className: "radio-button"
        }}
        type={"radio"}
        right={null}
        left={null}
        ref={ref}
        value={value}
        readOnly
        {...(value === radioGroup?.activeRadio ? {checked: true} : {checked: false})}
        {...rest}
        {...radioGroup?.validation}
    />

})

export default RadioButton