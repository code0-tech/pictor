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

const PinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {
    ref = ref || React.useRef(null)
    return <>{(props.splitFields) ? <SplitPinInput {...props} ref={ref}/> : <SinglePinInput {...props} ref={ref}/>}</>
})

const SplitPinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {
    const [pin, setPin] = useState<string[]>(Array(props.inputLength).fill(""));
    const indexes = Array.from({length: props.inputLength}, (_, i) => i);
    const inputsRef = useRef<HTMLInputElement[]>([]);

    const updateValue = (valArr: string[]) => {
        setPin(valArr);
        props.formValidation?.setValue(valArr.join(""));
    };

    const getInput = (index: number): HTMLInputElement => {
        return inputsRef.current[index]
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key !== "Backspace") return
        const newPin = [...pin];

        if (pin[index]) {
            newPin[index] = "";
            updateValue(newPin);
            return;
        }

        if (index > 0) {
            newPin[index - 1] = "";
            updateValue(newPin);
            inputsRef.current[index - 1]?.focus();
        }
    };

    const onChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        const input = e.target as HTMLInputElement
        const val = input.value;
        if (!val.match(allowedCharacters)) {
            input.value = ""
            return
        }

        const newPin = [...pin];
        newPin[index] = val;
        updateValue(newPin);

        if (val && index < props.inputLength - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData("text")
        const min = Math.min(props.inputLength, text.length)

        for (let i = 0; i < min; i++) {
            const input = getInput(i)
            const char = text[i]
            if (char) {
                input.value = char
            }

            const cutString = text.substring(0, min)
            inputsRef.current[min - 1]?.focus();
            updateValue(cutString.split(""))
        }
    }

    useEffect(() => {
        props.formValidation?.setValue(pin.join(""))
    }, [pin]);

    return <>
        {!!props.label ? <InputLabel children={props.label}/> : null}
        {!!props.description ? <InputDescription children={props.description}/> : null}
        <div className={"pin-input-group"}>
            {indexes.map((index) => (
                <Input
                    className={"pin-input"}
                    leftType={"action"}
                    type={"text"}
                    inputMode={"numeric"}
                    maxLength={1}
                    onChange={event => onChange(event, index)}
                    ref={(el) => {
                        if (el) inputsRef.current[index] = el;
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={event => onPaste(event)}
                />
            ))}
        </div>
        {!props.formValidation?.valid && props.formValidation?.notValidMessage ?
            <InputMessage children={props.formValidation.notValidMessage}/> : null}
    </>
})


const SinglePinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        const value = input.value

        if (!value.match(allowedCharacters)) {
            let sanitised = ""

            input.value.split("").forEach((char) => {
                if (char.match(allowedCharacters)) {
                    sanitised += char
                }
            })

            input.value = sanitised
            return
        }
    }

    return <Input
        leftType={"action"}
        type={"text"}
        inputMode={"numeric"}
        maxLength={props.inputLength}
        ref={ref}
        {...props}
        onChange={event => onChange(event)}
    />
})

export default PinInput