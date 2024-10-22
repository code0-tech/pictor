"use client"

import {RefObject, useCallback, useRef, useState} from "react";

export type Validations<Values> = Partial<{
    [Key in keyof Values]: (value: Values[Key]) => string | null;
}>

export interface FormValidationProps<Values> {
    initialValues: Values
    validate?: Validations<Values>,
    onSubmit?: (values: Values) => void
}

export interface ValidationProps<Value> {
    defaultValue?: Value
    valid?: boolean
    notValidMessage?: string | null
    ref?: RefObject<HTMLInputElement>
}

export type ValidationsProps<Values> = Partial<{
    [Key in keyof Values]: ValidationProps<Values[Key]>
}>

export type FormValidationReturn<Values> = [ValidationsProps<Values>, () => void]


const useForm = <Values extends Record<string, any> = Record<string, any>>(props: FormValidationProps<Values>): FormValidationReturn<Values> => {

    const {initialValues, validate, onSubmit = () => {}} = props

    const refs = Object.entries(initialValues).map(() =>  useRef<HTMLInputElement | null>(null))
    const [inputProps, setInputProps] = useState<ValidationsProps<Values>>({})

    const validateFunction = useCallback(() => {

        let submittable = true
        let inputProps: ValidationsProps<Values> = {}
        let submitProps: Object = {}

        Object.entries(initialValues).map(([k, v], index) => {

            const inputRef: RefObject<HTMLInputElement> = refs[index]
            const currentValue = inputRef.current?.value

            return {
                name: k,
                value: currentValue as typeof v || undefined,
                function: !!validate && !!validate[k] ? validate[k] : (value: typeof currentValue) => null
            }

        }).forEach((item, index) => {

            const message = item.value !== null ? item.function(item.value) : null
            submittable = submittable ? message === null ? true : !message : false

            Object.assign(inputProps, {
                [item.name]: {
                    defaultValue: item.value,
                    notValidMessage: message,
                    valid: message === null ? true : !message,
                    ref: refs[index]
                }
            })

            Object.assign(submitProps, {
                [item.name]: item.value
            })

        })

        setInputProps(() => inputProps)

        if (submittable) onSubmit(submitProps as Values)



    }, [])

    return [
        inputProps,
        validateFunction
    ]

}

export default useForm
