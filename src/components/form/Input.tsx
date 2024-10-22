import {Code0Component} from "../../utils/types";
import React, {LegacyRef} from "react";
import {ValidationProps} from "./useForm";
import {mergeCode0Props} from "../../utils/utils";
import "./Input.style.scss"
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";

type Code0Input = Omit<Omit<Omit<Omit<Code0Component<HTMLInputElement>, "defaultValue">, "left">, "right">, "label">

export interface InputProps<T> extends Code0Input, ValidationProps<T> {

    wrapperComponent?: Code0Component<HTMLDivElement>
    right?: React.ReactNode | React.ReactElement
    left?: React.ReactNode | React.ReactElement
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    label?: React.ReactNode | React.ReactElement
    description?: React.ReactNode | React.ReactElement
}


const Input: React.ForwardRefExoticComponent<InputProps<any>> = React.forwardRef((props: InputProps<any>, ref) => {

    const {
        wrapperComponent = {},
        label,
        description,
        disabled = false,
        left,
        right,
        leftType = "icon",
        rightType = "action",
        notValidMessage,
        valid = true,
        ...rest
    } = props

    return <>

        {!!label ? <InputLabel children={label}/> : null}
        {!!description ? <InputDescription children={description}/> : null}

        <div {...mergeCode0Props(`input ${!valid ? "input--not-valid" : ""}`, wrapperComponent)}>

            {!!left ? <div className={`input__left input__left--${leftType}`}>
                {left}
            </div>: null}

            <input ref={ref as LegacyRef<HTMLInputElement> | undefined} {...mergeCode0Props("input__control", rest)}/>

            {!!right ? <div className={`input__right input__right--${rightType}`}>
                {right}
            </div> : null}

        </div>

        {!valid && notValidMessage ? <InputMessage children={notValidMessage}/> : null}
    </>
})


export default Input