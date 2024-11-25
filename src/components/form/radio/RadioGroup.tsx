"use client"

import React, {useMemo} from "react";
import {ValidationProps} from "../useForm";
import {InputProps} from "../Input";

export interface RadioGroupContextProps {
    validation?: ValidationProps<string>
    activeRadio: string | null
    setActiveRadio: (radio: string) => void
}

export interface RadioGroupExoticProps {
    activeRadio: string | null
    setActiveRadio: (radio: string) => void
}

export interface RadioGroupProps extends Omit<InputProps<string>, "wrapperComponent" | "type" | "left" | "leftType" | "right" | "rightType" | "children"> {
    children: React.ReactElement[] | React.FC<RadioGroupExoticProps>
}

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(null)

export const useRadioGroup = () => React.useContext(RadioGroupContext)

const RadioGroup: React.FC<RadioGroupProps> = (props) => {

    const {
        children,
        formValidation,
        initialValue = null,
        required,
        label,
        description
    } = props
    const [radioStore, setRadioStore] = React.useState<string | null>(initialValue)

    const setActiveRadio = (radio: string) => {
        formValidation?.setValue(radio)
        setRadioStore(radio)
    }

    const child = typeof children === "function" ? useMemo(() => children({activeRadio: radioStore, setActiveRadio}), [radioStore]) : children

    return <RadioGroupContext.Provider value={{
        activeRadio: radioStore,
        setActiveRadio,
        validation: {
            formValidation: formValidation,
            initialValue: initialValue,
            required: required
        }
    }}>
        {/** TODO: add label and description **/}
        {child}
        {/** TODO: add error handling **/}
    </RadioGroupContext.Provider>

}

export default RadioGroup