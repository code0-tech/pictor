"use client"

import React, {useCallback, useEffect, useRef, useState} from "react";

export type Validations<Values> = Partial<{
    [Key in keyof Values]: (value: Values[Key], values?: Values) => string | null;
}>

export interface FormValidationProps<Values> {
    initialValues: Values
    validate?: Validations<Values>,
    truthyValidationBeforeSubmit?: boolean
    useInitialValidation?: boolean // defaults to true
    onSubmit?: (values: Values) => void
}

export interface ValidationProps<Value> {
    initialValue?: Value | undefined,
    defaultValue?: Value | undefined
    value?: Value | undefined
    required?: boolean
    formValidation?: {
        setValue?: (value: any) => void
        valid?: boolean
        notValidMessage?: string | null
    }
}

export type ValidationsProps<Values> = Partial<{
    [Key in keyof Values]: ValidationProps<Values[Key]>
}>

export type FormValidationReturn<Values> = [IValidation<Values>, <Key extends keyof Values>(key?: Key | any, submit?: boolean) => void, Values]

export interface IValidation<Values> {
    getInputProps<Key extends keyof Values>(key: Key): ValidationProps<Values[Key]>
    isValid(): boolean
}

class Validation<Values> implements IValidation<Values> {

    private readonly changeValue: (key: string, value: any) => void
    private readonly currentValues: Values
    private readonly currentValidations?: Validations<Values>
    private readonly shouldValidate: Map<keyof Values, boolean>
    private readonly cachedMessages: Map<keyof Values, string | null>

    constructor(
        changeValue: (key: string, value: any) => void,
        values: Values,
        validations: Validations<Values>,
        shouldValidate: Map<keyof Values, boolean> = new Map<keyof Values, boolean>(),
        cachedMessages: Map<keyof Values, string | null> = new Map()
    ) {
        this.changeValue = changeValue
        this.currentValues = values
        this.currentValidations = validations
        this.shouldValidate = shouldValidate
        this.cachedMessages = cachedMessages
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

        let message: string | null = null
        if (this.shouldValidate.has(key)) {
            message = currentFc(rawValue, this.currentValues)
            this.cachedMessages.set(key, message)
        } else {
            message = this.cachedMessages.get(key) ?? null
        }

        return {
            // @ts-ignore – z.B. wenn dein Input `defaultValue` kennt
            defaultValue: currentValue ?? undefined,
            initialValue: currentValue ?? undefined,
            formValidation: {
                setValue: (value: any) => {
                    this.changeValue(currentName, value)
                },
                ...({
                    notValidMessage: message,
                    valid: message === null,
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

    const {
        initialValues,
        validate = {},
        truthyValidationBeforeSubmit = true,
        useInitialValidation = true,
        onSubmit
    } = props

    const initValues = React.useMemo(() => initialValues as Values, [])
    const [values, setValues] = useState<Values>(initValues)
    const cachedMessagesRef = useRef<Map<keyof Values, string | null>>(new Map())

    const changeValue = useCallback((key: keyof Values, value: any) => {
        setValues(prevState => {
            return {
                ...prevState,
                [key]: value,
            }
        })
    }, [])

    const [validation, setValidation] = useState<Validation<Values>>(new Validation<Values>(
        changeValue,
        values,
        validate,
        useInitialValidation ? new Map<keyof Values, boolean>(Object.keys(initValues).map(k => [k as keyof Values, true])) : new Map<keyof Values, boolean>(),
        cachedMessagesRef.current
    ))

    useEffect(() => {
        setValues(initValues)
        setValidation(new Validation<Values>(
            changeValue,
            initValues,
            validate,
            useInitialValidation ? new Map<keyof Values, boolean>(Object.keys(initValues).map(k => [k as keyof Values, true])) : new Map<keyof Values, boolean>(),
            cachedMessagesRef.current
        ))
    }, [initValues])

    const validateFunction = useCallback(<Key extends keyof Values>(key?: Key, submit = true) => {

        const shouldValidateMap = key && new Set(Object.keys(values)).has(String(key))
            ? new Map<keyof Values, boolean>([[key, true]])
            : new Map<keyof Values, boolean>(Object.keys(values).map(k => [String(k) as keyof Values, true]))

        const currentValidation = new Validation<Values>(
            changeValue,
            values,
            validate,
            shouldValidateMap,
            cachedMessagesRef.current
        )

        setValidation(currentValidation)

        if (submit && !new Set(Object.keys(values)).has(String(key)) && onSubmit && (!truthyValidationBeforeSubmit || currentValidation.isValid())) {
            onSubmit(values as Values)
        }
    }, [changeValue, validate, onSubmit, truthyValidationBeforeSubmit, values])

    return [
        validation,
        validateFunction,
        values
    ]
}
