import Input, {InputProps} from "./Input";
import React, {RefObject, useEffect, useRef, useState} from "react";
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";

const allowedCharacters = /^[0-9a-zA-Z]+$/

interface PinInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type" | "left" | "right" | "leftType" | "rightType"> {
    inputLength: number
    splitFields: boolean
}

//TODO initial Value for pin
//TODO go befor a character press backspace will skip back without removing the char

const PinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {
    ref = ref || React.useRef(null)
    return <>{(props.splitFields) ? <SplitPinInput {...props} ref={ref}/> : <SinglePinInput {...props} ref={ref}/>}</>
})

const SplitPinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {
    const initialPin = props.initialValue
        ? props.initialValue.slice(0, props.inputLength).split("")
        : Array(props.inputLength).fill("");

    const [pin, setPin] = useState<string[]>(initialPin);
    const indexes = Array.from({ length: props.inputLength }, (_, i) => i);
    const inputsRef = useRef<HTMLInputElement[]>([]);

    const updateValue = (valArr: string[]) => {
        setPin(valArr);
        props.formValidation?.setValue(valArr.join(""));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key !== "Backspace") return;

        const inputEl = e.currentTarget;
        const cursorAtStart = inputEl.selectionStart === 0;
        const hasValue = inputEl.value.length > 0;

        const newPin = [...pin];

        if (cursorAtStart) {
            if (index > 0) {
                e.preventDefault();
                newPin[index - 1] = "";
                updateValue(newPin);
                inputsRef.current[index - 1]?.focus();
            } else {
                newPin[index] = "";
                updateValue(newPin);
            }
            return;
        }

        if (hasValue) {
            newPin[index] = "";
            updateValue(newPin);
            e.preventDefault();
        }
    };

    const onChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        const input = e.target as HTMLInputElement;
        const val = input.value;

        if (!val.match(allowedCharacters)) {
            input.value = "";
            return;
        }

        const newPin = [...pin];
        newPin[index] = val;
        updateValue(newPin);

        if (val && index < props.inputLength - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData("text");
        const cutString = text.slice(0, props.inputLength);
        const newPin = cutString.split("").map((char) =>
            char.match(allowedCharacters) ? char : ""
        );

        updateValue(newPin);
        inputsRef.current[newPin.length - 1]?.focus();
    };

    useEffect(() => {
        props.formValidation?.setValue(pin.join(""));
    }, [pin]);

    return (
        <>
            {props.label && <InputLabel>{props.label}</InputLabel>}
            {props.description && <InputDescription>{props.description}</InputDescription>}
            <div className={"pin-input-group"}>
                {indexes.map((index) => (
                    <Input
                        key={index}
                        className={"pin-input"}
                        leftType={"action"}
                        type={"text"}
                        inputMode={"numeric"}
                        maxLength={1}
                        value={pin[index]}
                        onChange={(event) => onChange(event, index)}
                        ref={(el) => {
                            if (el) inputsRef.current[index] = el;
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={(event) => onPaste(event)}
                    />
                ))}
            </div>
            {!props.formValidation?.valid && props.formValidation?.notValidMessage && (
                <InputMessage>{props.formValidation.notValidMessage}</InputMessage>
            )}
        </>
    );
});



const SinglePinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {
    const [value, setValue] = useState<string>(props.initialValue?.slice(0, props.inputLength) || "");

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const raw = input.value;
        const filtered = raw
            .split("")
            .filter((char) => char.match(allowedCharacters))
            .join("")
            .slice(0, props.inputLength);

        setValue(filtered);
        props.formValidation?.setValue(filtered);
    };

    return <Input
        leftType={"action"}
        type={"text"}
        inputMode={"numeric"}
        maxLength={props.inputLength}
        ref={ref}
        value={value}
        onChange={onChange}
        {...props}
    />
});

export default PinInput