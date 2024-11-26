import {Code0Component} from "../../utils/types";
import React, {LegacyRef, RefObject, useEffect} from "react";
import {ValidationProps} from "./useForm";
import {mergeCode0Props} from "../../utils/utils";
import "./Input.style.scss"
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";

type Code0Input = Omit<Omit<Omit<Omit<Code0Component<HTMLInputElement>, "defaultValue">, "left">, "right">, "label">

export interface InputProps<T> extends Code0Input, ValidationProps<T> {

    wrapperComponent?: Code0Component<HTMLDivElement>
    right?: React.ReactNode | React.ReactElement | React.ReactElement[]
    left?: React.ReactNode | React.ReactElement | React.ReactElement[]
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    label?: React.ReactNode | React.ReactElement
    description?: React.ReactNode | React.ReactElement
}

export const setElementKey = (element: HTMLElement, key: string, value: any, event: string) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, key)?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, key)?.set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter?.call(element, value);
    } else {
        valueSetter?.call(element, value);
    }

    element.dispatchEvent(new Event(event, { bubbles: true }));
}


const Input: React.ForwardRefExoticComponent<InputProps<any>> = React.forwardRef((props: InputProps<any>, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        wrapperComponent = {},
        label,
        description,
        disabled = false,
        left,
        right,
        leftType = "icon",
        rightType = "action",
        formValidation = {
            valid: true,
            notValidMessage: null,
            setValue: null
        },
        ...rest
    } = props

    useEffect(() => {
        if (!ref) return
        if (!ref.current) return
        if (!formValidation) return
        if (!formValidation.setValue) return

        // @ts-ignore
        ref.current.addEventListener("change", ev => formValidation.setValue(rest.type != "checkbox" ? ev.target.value : ev.target.checked))
    }, [ref])


    return <>

        {!!label ? <InputLabel children={label}/> : null}
        {!!description ? <InputDescription children={description}/> : null}

        <div {...mergeCode0Props(`input ${!formValidation?.valid ? "input--not-valid" : ""}`, wrapperComponent)}>

            {!!left ? <div className={`input__left input__left--${leftType}`}>
                {left}
            </div> : null}

            <input ref={ref as LegacyRef<HTMLInputElement> | undefined} {...mergeCode0Props("input__control", rest)}/>

            {!!right ? <div className={`input__right input__right--${rightType}`}>
                {right}
            </div> : null}

        </div>

        {!formValidation?.valid && formValidation?.notValidMessage ?
            <InputMessage children={formValidation.notValidMessage}/> : null}
    </>
})


export default Input