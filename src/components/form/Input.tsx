import {Code0Component, Color} from "../../utils/types";
import React from "react";
import {ValidationProps} from "./useForm";
import {mergeCode0Props} from "../../utils/utils";
import "./Input.style.scss"
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";

export interface InputProps<T> extends Omit<Code0Component<HTMLInputElement>, "label">, ValidationProps<T> {

    right?: React.ReactNode | React.ReactElement
    left?: React.ReactNode | React.ReactElement
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    label?: React.ReactNode | React.ReactElement
    description?: React.ReactNode | React.ReactElement
    color?: Color
}


const Input: React.FC<InputProps<any>> = React.forwardRef((props: InputProps<any>, ref) => {

    const {
        label,
        description,
        disabled = false,
        left,
        right,
        leftType = "icon",
        rightType = "action",
        notValidMessage,
        valid,
        ...rest
    } = props

    return <>

        {!!label ? <InputLabel children={label}/> : null}
        {!!description ? <InputDescription children={description}/> : null}

        <div className={`input ${!valid ? "input--not-valid" : ""}`}>

            {!!left ? <span className={`input__left input__left--${leftType}`}>
                {left}
            </span>: null}

            <input ref={ref} {...mergeCode0Props("input__control", rest)}/>

            {!!right ? <span className={`input__right input__right--${rightType}`}>
                {right}
            </span> : null}

        </div>

        {!valid && notValidMessage ? <InputMessage children={notValidMessage}/> : null}
    </>
})


export default Input