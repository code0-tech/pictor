import React from "react";
import {Checkbox, CheckboxIndicator, CheckboxProps, CheckedState} from "@radix-ui/react-checkbox"
import {InputProps} from "./Input";
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import {mergeCode0Props} from "../../utils/utils";
import InputMessage from "./InputMessage";
import "./Input.style.scss"
import {IconCheck, IconMinus} from "@tabler/icons-react";

export type CheckboxInputProps =
    Omit<InputProps<CheckedState>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType">
    & Omit<CheckboxProps, 'defaultChecked' | 'value' | 'defaultValue'>

export const CheckboxInput: React.FC<CheckboxInputProps> = (props) => {

    const [checked, setChecked] = React.useState<CheckedState>(props.initialValue ?? "indeterminate");

    const {
        title,
        description,
        formValidation = {
            valid: true,
            notValidMessage: null,
            setValue: (value: CheckedState) => {
            },
        },
        ...rest
    } = props

    return <>
        {!!title ? <InputLabel children={title}/> : null}
        {!!description ? <InputDescription children={description}/> : null}

        <div {...mergeCode0Props(`input ${!formValidation?.valid ? "input--not-valid" : ""} checkbox-input`, {})}>

            <Checkbox defaultChecked={checked} {...mergeCode0Props("checkbox-input__button", {
                ...rest, onCheckedChange: (value: CheckedState) => {
                    if (rest.onCheckedChange) rest.onCheckedChange!!(value)
                    setChecked(value)
                    formValidation.setValue(value)
                }
            })}>
                <CheckboxIndicator className={"checkbox-input__indicator"}>
                    {checked === "indeterminate" && <IconMinus size={10}/>}
                    {checked === true && <IconCheck size={10}/>}
                </CheckboxIndicator>
            </Checkbox>

            <div className={`input__right input__right--action}`}>
                {props.label}
            </div>
        </div>

        {!formValidation?.valid && formValidation?.notValidMessage ?
            <InputMessage children={formValidation.notValidMessage}/> : null}

    </>
}