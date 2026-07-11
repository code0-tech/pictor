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

interface CachedInputProps<Value> {
    value: Value | null
    message: string | null
    required: boolean
    props: ValidationProps<Value>
}

class Validation<Values> implements IValidation<Values> {

    private readonly changeValue: (key: string, value: any) => void
    private readonly currentValues: Values
    private readonly currentValidations?: Validations<Values>
    private readonly shouldValidate: Map<keyof Values, boolean>
    private readonly cachedMessages: Map<keyof Values, string | null>
    private readonly cachedSetters: Map<keyof Values, (value: any) => void>
    private readonly cachedProps: Map<keyof Values, CachedInputProps<any>>

    constructor(
        changeValue: (key: string, value: any) => void,
        values: Values,
        validations: Validations<Values>,
        shouldValidate: Map<keyof Values, boolean> = new Map<keyof Values, boolean>(),
        cachedMessages: Map<keyof Values, string | null> = new Map(),
        cachedSetters: Map<keyof Values, (value: any) => void> = new Map(),
        cachedProps: Map<keyof Values, CachedInputProps<any>> = new Map()
    ) {
        this.changeValue = changeValue
        this.currentValues = values
        this.currentValidations = validations
        this.shouldValidate = shouldValidate
        this.cachedMessages = cachedMessages
        this.cachedSetters = cachedSetters
        this.cachedProps = cachedProps
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

        const required = Boolean(this.currentValidations && this.currentValidations[key])

        // Reuse the cached props object as long as nothing for this key changed, so
        // consumers can memoize directly on the getInputProps output.
        const cached = this.cachedProps.get(key)
        if (cached && Object.is(cached.value, currentValue) && cached.message === message && cached.required === required) {
            return cached.props
        }

        // One setValue per key for the lifetime of the form: changeValue reads from
        // valuesRef and never goes stale, so the wrapper never has to be rebuilt.
        let setValue = this.cachedSetters.get(key)
        if (!setValue) {
            const changeValue = this.changeValue
            setValue = (value: any) => {
                changeValue(currentName, value)
            }
            this.cachedSetters.set(key, setValue)
        }

        const props: ValidationProps<Values[Key]> = {
            // @ts-ignore – z.B. wenn dein Input `defaultValue` kennt
            defaultValue: currentValue ?? undefined,
            initialValue: currentValue ?? undefined,
            formValidation: {
                setValue,
                ...({
                    notValidMessage: message,
                    valid: message === null,
                })
            },
            ...(required
                ? {required: true}
                : {})
        }
        this.cachedProps.set(key, {value: currentValue, message, required, props})
        return props
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

    const initValues = React.useMemo(() => initialValues as Values, [initialValues])
    const [values, setValues] = useState<Values>(initValues)
    const cachedMessagesRef = useRef<Map<keyof Values, string | null>>(new Map())
    const cachedSettersRef = useRef<Map<keyof Values, (value: any) => void>>(new Map())
    const cachedPropsRef = useRef<Map<keyof Values, CachedInputProps<any>>>(new Map())
    const valuesRef = useRef<Values>(values)
    valuesRef.current = values

    const changeValue = useCallback((key: keyof Values, value: any) => {
        valuesRef.current = {...valuesRef.current, [key]: value}
        setValues(valuesRef.current)
    }, [])

    const [validation, setValidation] = useState<Validation<Values>>(() => new Validation<Values>(
        changeValue,
        values,
        validate,
        useInitialValidation ? new Map<keyof Values, boolean>(Object.keys(initValues).map(k => [k as keyof Values, true])) : new Map<keyof Values, boolean>(),
        cachedMessagesRef.current,
        cachedSettersRef.current,
        cachedPropsRef.current
    ))

    const didInitRef = useRef(false)
    useEffect(() => {
        valuesRef.current = initValues
        setValues(initValues)
        // Form reset: props must be rebuilt from the new initial values. The setter
        // cache survives on purpose — changeValue is stable, so the setters stay valid.
        // On mount the cache only holds props built from these initValues, so keep it.
        if (didInitRef.current) {
            cachedPropsRef.current.clear()
        }
        didInitRef.current = true
        setValidation(new Validation<Values>(
            changeValue,
            initValues,
            validate,
            useInitialValidation ? new Map<keyof Values, boolean>(Object.keys(initValues).map(k => [k as keyof Values, true])) : new Map<keyof Values, boolean>(),
            cachedMessagesRef.current,
            cachedSettersRef.current,
            cachedPropsRef.current
        ))
    }, [initValues])

    const validateFunction = useCallback(<Key extends keyof Values>(key?: Key, submit = true) => {

        const currentValues = valuesRef.current

        const shouldValidateMap = key && new Set(Object.keys(currentValues)).has(String(key))
            ? new Map<keyof Values, boolean>([[key, true]])
            : new Map<keyof Values, boolean>(Object.keys(currentValues).map(k => [String(k) as keyof Values, true]))

        const currentValidation = new Validation<Values>(
            changeValue,
            currentValues,
            validate,
            shouldValidateMap,
            cachedMessagesRef.current,
            cachedSettersRef.current,
            cachedPropsRef.current
        )

        setValidation(currentValidation)

        if (submit && !new Set(Object.keys(currentValues)).has(String(key)) && onSubmit && (!truthyValidationBeforeSubmit || currentValidation.isValid())) {
            onSubmit(currentValues)
        }
    }, [changeValue, validate, onSubmit, truthyValidationBeforeSubmit])

    return [
        validation,
        validateFunction,
        values
    ]
}
