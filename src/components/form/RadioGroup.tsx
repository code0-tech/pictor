import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import {InputProps} from "./Input";
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";
import "./Input.style.scss"

export type RadioGroupProps =
    Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType">
    & RadixRadioGroup.RadioGroupProps

export const RadioGroup: React.FC<RadioGroupProps> = (props) => {

    const {
        title,
        description,
        initialValue,
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


        <RadixRadioGroup.RadioGroup defaultValue={initialValue ?? props.defaultValue} {...mergeCode0Props("radio-group", {
            ...rest, onValueChange: (value: string) => {
                if (rest.onValueChange) rest.onValueChange!!(value)
                formValidation.setValue(value)
            }
        })}/>

        {!formValidation?.valid && formValidation?.notValidMessage ?
            <InputMessage children={formValidation.notValidMessage}/> : null}

    </>
}