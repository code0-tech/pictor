import {Component, mergeComponentProps} from "../../utils";
import React from "react";
import {ValidationProps} from "./useForm";
import {InputMessage} from "./InputMessage";
import {InputLabel} from "./InputLabel";
import {InputDescription} from "./InputDescription";
import "./InputWrapper.style.scss"

export interface InputWrapperProps<T = any> extends Omit<Component<HTMLElement>, 'left' | 'right' | 'title' | "defaultValue" | "value">, ValidationProps<T> {
    right?: React.ReactNode
    left?: React.ReactNode
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    title?: React.ReactNode
    description?: React.ReactNode
    wrapperComponent?: Component<HTMLDivElement>
}

export const InputWrapper: React.ForwardRefExoticComponent<InputWrapperProps> = React.forwardRef((props, ref) => {

    const {
        children,
        wrapperComponent = {},
        left,
        right,
        leftType = "icon",
        rightType = "action",
        title,
        description,
        formValidation = {valid: true, notValidMessage: null, setValue: null}
    } = props

    return <>

        {title && <InputLabel>{title}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}

        <div {...mergeComponentProps(`input-wrapper ${!formValidation?.valid ? "input-wrapper--not-valid" : ""}`, wrapperComponent)}>
            {left && <div className={`input-wrapper__left input__left--${leftType}`}>{left}</div>}
            {children}
            {right && <div className={`input-wrapper__right input-wrapper__right--${rightType}`}>{right}</div>}
        </div>

        {!formValidation?.valid && formValidation?.notValidMessage && (
            <InputMessage>{formValidation.notValidMessage}</InputMessage>
        )}

    </>
})