import {
    OneTimePasswordField,
    OneTimePasswordFieldHiddenInput,
    OneTimePasswordFieldHiddenInputProps,
    OneTimePasswordFieldInput,
    OneTimePasswordFieldInputProps,
    OneTimePasswordFieldProps
} from "@radix-ui/react-one-time-password-field";
import {ComponentProps, mergeComponentProps} from "../../utils";
import React from "react";
import {InputProps} from "./Input";
import {InputLabel} from "./InputLabel";
import {InputDescription} from "./InputDescription";
import {InputMessage} from "./InputMessage";
import "./Input.style.scss"

type PinInputProps =
    Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType">
    & OneTimePasswordFieldProps
type PinInputFieldProps = ComponentProps & OneTimePasswordFieldInputProps
type PinInputHiddenFieldProps = ComponentProps & OneTimePasswordFieldHiddenInputProps

export const PinInput: React.FC<PinInputProps> = (props) => {

    const {
        title,
        description,
        disabled = false,
        formValidation = {
            valid: true,
            notValidMessage: null,
            setValue: (value: string) => {
            },
        },
        ...rest
    } = props

    return <>
        {!!title ? <InputLabel children={title}/> : null}
        {!!description ? <InputDescription children={description}/> : null}

        <OneTimePasswordField {...mergeComponentProps(`pin-input ${!formValidation?.valid ? "pin-input--not-valid" : ""}`, {
            ...rest, disabled, onValueChange: (value: string) => {
                if (rest.onValueChange) rest.onValueChange!!(value)
                formValidation.setValue?.(value)
            }
        })}/>

        {!formValidation?.valid && formValidation?.notValidMessage ?
            <InputMessage children={formValidation.notValidMessage}/> : null}

    </>
}

export const PinInputField: React.FC<PinInputFieldProps> = (props) => {
    return <OneTimePasswordFieldInput {...mergeComponentProps("pin-input__field", props)}/>
}

export const PinInputHiddenField: React.FC<PinInputHiddenFieldProps> = (props) => {
    return <OneTimePasswordFieldHiddenInput {...mergeComponentProps("pin-input__hidden-field", props)}/>
}
