"use client"

import {useCallback, useEffect, useMemo, useState} from "react";

export type Validations<Values> = Partial<{
    [Key in keyof Values]: (value: Values[Key], values?: Values) => string | null;
}>

export interface FormValidationProps<Values> {
    initialValues: Values
    validate?: Validations<Values>,
    truthyValidationBeforeSubmit?: boolean
    onSubmit?: (values: Values) => void
}

export interface ValidationProps<Value> {
    initialValue?: Value | null
    required?: boolean
    formValidation?: {
        setValue: (value: any) => void
        valid?: boolean
        notValidMessage?: string | null
    }
}

export type ValidationsProps<Values> = Partial<{
    [Key in keyof Values]: ValidationProps<Values[Key]>
}>

export type FormValidationReturn<Values> = [IValidation<Values>, () => void]

export interface IValidation<Values> {
    getInputProps<Key extends keyof Values>(key: Key): ValidationProps<Values[Key]>
    isValid(): boolean
}

class Validation<Values> implements IValidation<Values> {

    private readonly changeValue: (key: string, value: any) => void
    private readonly initialRender: boolean
    private readonly currentValues: Values
    private readonly currentValidations?: Validations<Values>

    constructor(
        changeValue: (key: string, value: any) => void,
        values: Values,
        validations: Validations<Values>,
        initial: boolean
    ) {
        this.changeValue = changeValue
        this.currentValues = values
        this.currentValidations = validations
        this.initialRender = initial
    }

    isValid(): boolean {
        if (!this.currentValidations) return true
        for (const key in this.currentValidations) {
            const validateFn = this.currentValidations[key as keyof Values]
            if (validateFn) {
                const message = validateFn(
                    this.currentValues[key as keyof Values],
                    this.currentValues
                )
                if (message !== null) return false
            }
        }

        return true
    }

    getInputProps<Key extends keyof Values>(key: Key): ValidationProps<Values[Key]> {
        const rawValue = this.currentValues[key]
        const currentValue = (rawValue ?? null) as Values[Key] | null
        const currentName = key as string

        const currentFc =
            this.currentValidations && this.currentValidations[key]
                ? this.currentValidations[key]!
                : (_value: Values[Key]) => null

        const message = !this.initialRender
            ? currentFc(rawValue, this.currentValues)
            : null

        return {
            // @ts-ignore – z.B. wenn dein Input `defaultValue` kennt
            defaultValue: currentValue,
            initialValue: currentValue,
            formValidation: {
                setValue: (value: any) => {
                    this.changeValue(currentName, value)
                },
                ...(!this.initialRender
                    ? {
                        notValidMessage: message,
                        valid: message === null,
                    }
                    : {
                        valid: true,
                    })
            },
            ...(this.currentValidations && this.currentValidations[key]
                ? {required: true}
                : {})
        }
    }
}

export const useForm = <
    Values extends Record<string, any> = Record<string, any>
>(props: FormValidationProps<Values>): FormValidationReturn<Values> => {

    const {initialValues, validate = {}, truthyValidationBeforeSubmit = true, onSubmit} = props

    const [values, setValues] = useState<Values>(initialValues)
    const [hasValidated, setHasValidated] = useState(false)

    useEffect(() => {
        setValues(initialValues)
        setHasValidated(false)
    }, [initialValues])

    const changeValue = useCallback((key: keyof Values, value: any) => {
        setValues(prevState => ({
            ...prevState,
            [key]: value,
        }))
    }, [])

    const validation = useMemo(
        () => new Validation<Values>(changeValue, values, validate, !hasValidated),
        [changeValue, values, validate, hasValidated]
    )

    const validateFunction = useCallback(() => {
        setHasValidated(true)

        const currentValidation = new Validation<Values>(
            changeValue,
            values,
            validate,
            false
        )

        if (onSubmit && (!truthyValidationBeforeSubmit || currentValidation.isValid())) {
            onSubmit(values as Values)
        }
    }, [changeValue, values, validate, onSubmit])

    return [
        validation,
        validateFunction
    ]
}