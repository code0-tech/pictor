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
}

export const InputWrapper: React.ForwardRefExoticComponent<InputWrapperProps> = React.forwardRef((props, ref) => {

    const {
        children,
        left,
        right,
        leftType = "icon",
        rightType = "action",
        title,
        description,
        formValidation = {valid: true, notValidMessage: null, setValue: null},
        ...rest
    } = props

    const generatedId = React.useId()
    const inputId = (rest.id as string | undefined) ?? generatedId
    const labelId = `${inputId}-label`

    const ariaLabelFallback = !title
        ? ((rest["aria-label"] as string | undefined) ?? (rest.placeholder as string | undefined))
        : undefined
    const accessibilityProps = {
        id: inputId,
        ...(title ? {"aria-labelledby": labelId} : {}),
        ...(ariaLabelFallback ? {"aria-label": ariaLabelFallback} : {}),
    }

    return <>

        {title && <InputLabel htmlFor={inputId} id={labelId}>{title}</InputLabel>}
        {description && <InputDescription>{description}</InputDescription>}

        <div {...mergeComponentProps(`input-wrapper ${!formValidation?.valid ? "input-wrapper--not-valid" : ""}`, rest)}>
            {left && <div className={`input-wrapper__left input__left--${leftType}`}>{left}</div>}
            {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement, {...accessibilityProps})
                : children}
            {right && <div className={`input-wrapper__right input-wrapper__right--${rightType}`}>{right}</div>}
        </div>

        {!formValidation?.valid && formValidation?.notValidMessage && (
            <InputMessage>{formValidation.notValidMessage}</InputMessage>
        )}

    </>
})