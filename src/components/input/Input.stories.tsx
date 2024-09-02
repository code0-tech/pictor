import React from "react";
import {Input, InputWrapper} from "./Input";
import {useValidation} from "./useValidation";

export default {
    title: "Input",
    component: Input
};

export const Default = () => {
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