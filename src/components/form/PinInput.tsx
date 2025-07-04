import {
    OneTimePasswordField, OneTimePasswordFieldHiddenInput,
    OneTimePasswordFieldHiddenInputProps, OneTimePasswordFieldInput,
    OneTimePasswordFieldInputProps,
    OneTimePasswordFieldProps
} from "@radix-ui/react-one-time-password-field";
import {Code0ComponentProps} from "../../utils/types";
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import {InputProps} from "./Input";
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";
import "./Input.style.scss"

type PinInputProps =
    Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType">
    & OneTimePasswordFieldProps
type PinInputFieldProps = Code0ComponentProps & OneTimePasswordFieldInputProps
type PinInputHiddenFieldProps = Code0ComponentProps & OneTimePasswordFieldHiddenInputProps

export const PinInput: React.FC<PinInputProps> = (props) => {

    const {
        label,
        description,
        disabled = false,
        formValidation = {
            valid: true,
            notValidMessage: null,
            setValue: (value: string) => {},
        },
        ...rest
    } = props

    return <>
        {!!label ? <InputLabel children={label}/> : null}
        {!!description ? <InputDescription children={description}/> : null}

        <div {...mergeCode0Props(`${!formValidation?.valid ? "input--not-valid" : ""}`, {})}>
            <OneTimePasswordField {...mergeCode0Props("pin-input", {
                ...rest, onValueChange: (value: string) => {
                    if (rest.onValueChange) rest.onValueChange!!(value)
                    formValidation.setValue(value)
                }
            })}/>
        </div>

        {!formValidation?.valid && formValidation?.notValidMessage ?
            <InputMessage children={formValidation.notValidMessage}/> : null}

    </>
}

export const PinInputField: React.FC<PinInputFieldProps> = (props) => {
    return <OneTimePasswordFieldInput {...mergeCode0Props("input pin-input__field", props)}/>
}

export const PinInputHiddenField: React.FC<PinInputHiddenFieldProps> = (props) => {
    return <OneTimePasswordFieldHiddenInput {...mergeCode0Props("pin-input__hidden-field", props)}/>
}
