import React, {LegacyRef, useRef} from "react"

import {Component, mergeComponentProps} from "../../utils"
import {ValidationProps} from "./useForm"

import "./Input.style.scss"

import {InputWrapper} from "./InputWrapper"

export type Code0Input = Omit<Component<HTMLInputElement>, "left" | "right" | "title" | "defaultValue" | "value">

export interface InputProps<T> extends Code0Input, ValidationProps<T> {
    wrapperComponent?: Component<HTMLDivElement>
    right?: React.ReactNode
    left?: React.ReactNode
    leftType?: "action" | "placeholder" | "icon"
    rightType?: "action" | "placeholder" | "icon"
    title?: React.ReactNode
    description?: React.ReactNode
}

export type InputElement = HTMLInputElement | HTMLDivElement

const normalizeTextValue = (rawValue: any): string => {
    const normalized = rawValue ?? ""
    return typeof normalized === "string" ? normalized : String(normalized)
}

const InputComponent = React.forwardRef<InputElement, InputProps<any>>(
    (props, ref) => {
        const {
            wrapperComponent = {},
            title,
            description,
            disabled = false,
            left,
            right,
            leftType = "icon",
            rightType = "action",
            formValidation = {valid: true, notValidMessage: null},
            initialValue,
            ...rest
        } = props

        const {
            onChange: userOnChange,
            onInput: userOnInput,
            ...inputProps
        } = rest

        const generatedId = React.useId()
        const inputId = (inputProps.id as string | undefined) ?? generatedId
        const ariaLabelFallback = !title
            ? ((inputProps["aria-label"] as string | undefined) ?? (inputProps.placeholder as string | undefined))
            : undefined
        const accessibilityProps = {
            id: inputId,
            ...(ariaLabelFallback ? {"aria-label": ariaLabelFallback} : {}),
        }

        const inputRef = useRef<HTMLInputElement>(null)
        const lastValidationValueRef = useRef<any>(null)

        React.useImperativeHandle(ref, () => inputRef.current as InputElement)

        const syncValidationValue = React.useCallback(
            (currentValue: any) => {
                if (!formValidation?.setValue) return
                const validationValue = inputProps.type !== "checkbox" ? normalizeTextValue(currentValue) : currentValue
                if (Object.is(lastValidationValueRef.current, validationValue)) return
                lastValidationValueRef.current = validationValue
                formValidation.setValue(validationValue)
            },
            [formValidation?.setValue, inputProps.type],
        )

        const handleValueChange = React.useCallback(
            (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const target = event.currentTarget
                const nextValue = inputProps.type === "checkbox" && "checked" in target
                    ? (target as HTMLInputElement).checked
                    : target.value
                syncValidationValue(nextValue)
            },
            [inputProps.type, syncValidationValue],
        )

        const controlProps = mergeComponentProps("input-wrapper__control input__control", inputProps)

        const control = inputProps.type === "textarea" ? (
            <textarea
                ref={inputRef as LegacyRef<HTMLTextAreaElement>}
                {...controlProps}
                {...accessibilityProps}
                onInput={(event) => {
                    handleValueChange(event)
                    userOnInput?.(event as any)
                }}
                onChange={(event) => {
                    handleValueChange(event)
                    userOnChange?.(event as any)
                }}
                spellCheck={false}
                disabled={disabled}
            />
        ) : (
            <input
                ref={inputRef as LegacyRef<HTMLInputElement>}
                {...controlProps}
                {...accessibilityProps}
                onInput={(event) => {
                    handleValueChange(event)
                    userOnInput?.(event as any)
                }}
                onChange={(event) => {
                    handleValueChange(event)
                    userOnChange?.(event as any)
                }}
                spellCheck={false}
                disabled={disabled}
            />
        )

        return (
            <InputWrapper
                title={title}
                description={description}
                left={left}
                right={right}
                leftType={leftType}
                rightType={rightType}
                formValidation={formValidation}
                wrapperComponent={wrapperComponent}
            >
                {control}
            </InputWrapper>
        )
    },
)

export const Input: React.FC<InputProps<any>> = InputComponent as React.FC<InputProps<any>>
