import React from "react";
import Input, {InputWrapper, PinInput} from "./Input";
import {useValidation} from "./useValidation";

export default {
    title: "Input",
    component: Input
};

export const DefaultInput = () => {
    const rules = [
        (value: string) => ({
            isValid: value.trim() !== "",
            message: "Email is required"
        }),
        (value: string) => ({
            isValid: value.includes("@"),
            message: "Email is invalid"
        })
    ];

    const { value, setValue, state, message, validateInput } = useValidation({
        validationRules: rules,
        successMessage: "Email is valid"
    });

    return (
        <InputWrapper
            label="Email"
            description="Please enter your email address"
            success={{ value: state === "success", message }}
            warning={{ value: state === "warning", message }}
            error={{ value: state === "error", message }}
        >
            <Input
                value={value}
                onValueChange={(value: string) => {
                    console.log(value);
                    setValue(value);
                }}
                onBlur={validateInput}
            />
        </InputWrapper>
    );
}

export const DefaultPinInput = () => {
    const rules = [
        (value: string) => ({
            isValid: value === "1234",
            message: "Email is required"
        })
    ];

    const { value, setValue, state, message, validateInput } = useValidation({
        validationRules: rules,
        successMessage: "Email is valid"
    });

    return (
        <InputWrapper
            label="Pin"
            description="Please enter your pin"
            success={{ value: state === "success", message }}
            warning={{ value: state === "warning", message }}
            error={{ value: state === "error", message }}
        >
            <PinInput
                value={value}
                onValueChange={(value: string) => {
                    console.log(value);
                    setValue(value);
                }}
                onBlur={validateInput}
            />
        </InputWrapper>
    );
}