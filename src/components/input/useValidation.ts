import {useCallback, useState} from "react";

export type ValidationRule = (value: string) => {
    isValid: boolean;
    message: string;
}

type ValidationStatus = 'idle' | 'error' | 'warning' | 'success';

interface UseInputValidationProps {
    //default value is empty string
    initialValue?: string;
    validationRules: ValidationRule[];
    //default is 0
    warningBuffer?: number;
    successMessage?: string;
    warningMessage?: string;
}

export function useValidation({ initialValue = "", validationRules, warningBuffer = 0, successMessage, warningMessage }: UseInputValidationProps) {
    const [value, setValue] = useState<string>(initialValue);
    const [state, setState] = useState<ValidationStatus>('idle');
    const [message, setMessage] = useState<string>("");

    const validateInput = useCallback(() => {
        if (!validationRules) return;
        let errorCount = 0;
        let errorMessage = "";

        for (const rule of validationRules) {
            const {isValid, message} = rule(value);
            if (isValid) continue;
            errorCount++;
            if (!errorMessage) errorMessage = message;
        }

        if (errorCount === 0) {
            setState('success');
            setMessage(successMessage || 'Input is valid');
        } else if (errorCount <= warningBuffer && warningMessage) {
            setState('warning');
            setMessage(warningMessage || 'Input is valid but with warnings');
        } else {
            setState('error');
            setMessage(errorMessage.trim() === "" ? "Input is invalid" : errorMessage);
        }
    }, [successMessage, validationRules, value, warningBuffer, warningMessage]);

    return {value, setValue, state, message, validateInput};
}