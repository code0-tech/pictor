import React, {
    DetailedHTMLProps,
    InputHTMLAttributes,
    ReactElement,
    ReactNode,
    RefAttributes, useEffect,
    useRef,
    useState
} from "react";
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
    value: string;
    onValueChange?: (value: string) => void;
    onBlur?: () => void;
    preValue?: number[];
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
            className={"input"}
            spellCheck={false}
            value={value}
            onChange={handleChange}
            {...props}
        />
    );
}

const PinInput: React.FC<PinInputType> = ({ value, preValue, onValueChange, onBlur, ...props }) => {
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const focusNextInput = (currentIndex: number) => {
        if (currentIndex < 3) {
            inputRefs[currentIndex + 1].current?.focus();
        } else {
            inputRefs[currentIndex].current?.blur();
            onBlur?.();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 1 && /^\d*$/.test(inputValue)) {
            const newValue = value.split('');
            newValue[index] = inputValue;
            onValueChange?.(newValue.join(''));

            if (inputValue.length === 1) {
                focusNextInput(index);
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div className={"pin-input"}>
            {inputRefs.map((ref, index) => (
                <input
                    key={index}
                    ref={ref}
                    className={"pin-input__input"}
                    type={"text"}
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    {...props}
                />
            ))}
        </div>
    );
}

const InputWrapper: React.FC<InputWrapperType> = ({label, description, success, warning, error, children}) => {
    return (
        <div className={"input-wrapper"}>
        {label && <label className={"input-wrapper__label"}>{label}</label>}
            {description && <p className={"input-wrapper__description"}>{description}</p>}
            {children}
            {success?.value && <p className={"input-wrapper__message input-wrapper__message--success"}>{success.message}</p>}
            {warning?.value && <p className={"input-wrapper__message input-wrapper__message--warning"}>{warning.message}</p>}
            {error?.value && <p className={"input-wrapper__message input-wrapper__message--error"}>{error.message}</p>}
        </div>
    );
}


export {
    Input as default,
    PinInput,
    InputWrapper
};