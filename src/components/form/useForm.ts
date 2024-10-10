"use client"

import {RefObject, useCallback, useMemo, useRef, useState} from "react";

export type Validations<Values> = Partial<{
    [Key in keyof Values]: (value: Values[Key]) => string | null;
}>

interface FormValidationProps<Values> {
    initialValues: Values
    validate?: Validations<Values>
}

interface ValidationProps<Value> {
    value: Value
    valid: boolean
    notValidMessage: string | null
    ref: RefObject<HTMLInputElement>
}

type ValidationsProps<Values> = Partial<{
    [Key in keyof Values]: ValidationProps<Values[Key]>
}>

type FormValidationReturn<Values> = [ValidationsProps<Values>, () => void]

const useForm = <Values extends Record<string, any> = Record<string, any>>(props: FormValidationProps<Values>): FormValidationReturn<Values> => {

    const {initialValues, validate} = props

    const refs = Object.entries(initialValues).map(() =>  useRef<HTMLInputElement | null>(null))
    const [valuesState, setValuesStore] = useState<Values>(initialValues)
    const inputProps = useMemo<ValidationsProps<Values>>(() => {

        let inputProps: ValidationsProps<Values> = {}

        Object.entries(valuesState).map(([k, v]) => ({
            name: k,
            initialValue: v,
            function: !!validate && !!validate[k] ? validate[k] : (value: typeof v) => null
        })).forEach((item, index) => {
            Object.assign(inputProps, {
                [item.name]: {
                    defaultValue: item.initialValue,
                    notValidMessage: item.function(item.initialValue),
                    valid: !item.function(item.initialValue),
                    ref: refs[index]
                }
            })
        })

        return inputProps

    }, [valuesState])

    const validateFunction = useCallback(() => {

        let values: { [index: string]: any } = {...valuesState}

        Object.entries(inputProps as ValidationsProps<Values>).forEach(([key, value]) => {
            const inputRef: RefObject<HTMLInputElement> = value.ref
            values[key] = inputRef.current?.value
        })

        setValuesStore(() => values as Values)

    }, [inputProps])

    return [
        inputProps,
        validateFunction
    ]

}

export default useForm
