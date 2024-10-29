"use client"

import {ChangeEvent, ChangeEventHandler, useCallback, useMemo, useState} from "react";

export type Validations<Values> = Partial<{
    [Key in keyof Values]: (value: Values[Key]) => string | null;
}>

export interface FormValidationProps<Values> {
    initialValues: Values
    validate?: Validations<Values>,
    onSubmit?: (values: Values) => void
}

export interface ValidationProps<Value> {
    checked?: boolean
    defaultValue?: Value
    required?: boolean
    formValidation?: {
        onChange: ChangeEventHandler
        valid?: boolean
        notValidMessage?: string | null
    }
}

export type ValidationsProps<Values> = Partial<{
    [Key in keyof Values]: ValidationProps<Values[Key]>
}>

export type FormValidationReturn<Values> = [IValidation<Values>, () => void]

export interface IValidation<Values> {
    getInputProps(key: keyof Values, options: { type: "input" | "checkbox" | "radio" }): ValidationProps<Values>
}

class Validation<Values> implements IValidation<Values> {

    private readonly changeValue: (key: string, value: any) => void
    private readonly initialRender: boolean
    private readonly currentValues: Values
    private readonly currentValidations?: Validations<Values>

    constructor(changeValue, values, validations, initial) {
        this.changeValue = changeValue
        this.currentValues = values
        this.currentValidations = validations
        this.initialRender = initial
    }

    public getInputProps(key: keyof Values, options: {
        type: "input" | "checkbox" | "radio"
    }): ValidationProps<Values> {

        const currentValue = (this.currentValues[key] as null) || undefined
        const currentName = key
        const currentFc = !!this.currentValidations && !!this.currentValidations[key] ? this.currentValidations[key] : (value: typeof currentValue) => null
        const message = !this.initialRender ? currentFc(currentValue) : null

        return {
            defaultValue: currentValue,
            formValidation: {
                onChange: (event: ChangeEvent) => {
                    this.changeValue(currentName, (event.target as HTMLInputElement).value)
                },
                ...(!this.initialRender ? {
                    notValidMessage: message,
                    valid: message === null ? true : !message,
                } : {
                    valid: true,
                })
            },
            ...(!!this.currentValidations && !!this.currentValidations[key] ? {required: true} : {})
        }
    }
}

const useForm = <Values extends Record<string, any> = Record<string, any>>(props: FormValidationProps<Values>): FormValidationReturn<Values> => {

    const {initialValues, validate, onSubmit} = props
    const [values, setValues] = useState<Values>(initialValues)
    const changeValue = (key: string, value: any) => setValues(prevState => {
        prevState[key] = value
        return prevState
    })
    const initialInputProps = useMemo(() => new Validation(changeValue, initialValues, validate, true), [])
    const [inputProps, setInputProps] = useState<IValidation<Values>>(initialInputProps)

    const validateFunction = useCallback(() => {

        let inputProps: IValidation<Values> = new Validation(changeValue, values, validate, false)

        setInputProps(() => inputProps)
        if (onSubmit) onSubmit(values as Values)

    }, [])

    return [
        inputProps,
        validateFunction
    ]

}

export default useForm
