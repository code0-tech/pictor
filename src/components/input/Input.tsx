import React, {DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode, RefAttributes, useState} from "react";
import "./Input.style.scss"
import {TablerIcon} from "@tabler/icons-react";
import {Code0Component} from "../../utils/types";

export type InputState = {
    value: boolean;
    message: string;
}

export interface InputType extends InputHTMLAttributes<HTMLInputElement> {
    onValueChange?: (value: string) => void;
    preValue?: string;
}

export interface PinInputType {

}

export interface InputWrapperType {
    label?: string;
    description?: string;
    success?: InputState;
    warning?: InputState;
    error?: InputState;
    children: ReactNode;
}

const Input: React.FC<InputType> = ({ preValue, onValueChange, ...props }) => {
    const [value, setValue] = useState<string>(preValue || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        onValueChange?.(inputValue);
    }

    return (
        <input
            className="input"
            spellCheck={false}
            value={value}
            onChange={handleChange}
            {...props}
        />
    );
}

const PinInput: React.FC<PinInputType> = () => {
    return (
        <div className="pin-input">
        </div>
    );
}

const InputWrapper: React.FC<InputWrapperType> = ({ label, description, success, warning, error, children }) => {
    return (
        <div className="input-wrapper">
            {label && <label className="input-wrapper__label">{label}</label>}
            {description && <p className="input-wrapper__description">{description}</p>}
            {children}
            {success?.value && <p className="input-wrapper__message input-wrapper__message--success">{success.message}</p>}
            {warning?.value && <p className="input-wrapper__message input-wrapper__message--warning">{warning.message}</p>}
            {error?.value && <p className="input-wrapper__message input-wrapper__message--error">{error.message}</p>}
        </div>
    );
}


export {
    Input as default,
    PinInput,
    InputWrapper
};