import Input, {InputProps} from "./Input";
import React, {RefObject, useEffect, useRef, useState} from "react";
import InputLabel from "./InputLabel";
import InputDescription from "./InputDescription";
import InputMessage from "./InputMessage";

interface PinInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"| "left" | "right" | "leftType" | "rightType" > {
    inputLength: number
    splitFields: boolean
}

const PinInput: React.ForwardRefExoticComponent<PinInputProps> = React.forwardRef((props, ref: RefObject<HTMLInputElement>) => {

    ref = ref || React.useRef(null)

    const {
        ...rest
    } = props

    if (props.splitFields) {
        const [pin, setPin] = useState<string[]>(Array(props.inputLength).fill(""));
        const indexes = Array.from({ length: props.inputLength }, (_, i) => i);
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
            if (!val.match(/^[0-9a-zA-Z]+$/)) {
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

            for (let i = 0; i < props.inputLength; i++) {
                const input = getInput(i)
                const char = text[i]
                if (char) {
                    input.value = char
                }

                const cutString = text.substring(0, props.inputLength - 1)
                updateValue(cutString.split(""))
            }
        }

        useEffect(() => {
            props.formValidation?.setValue(pin.join(""))
        }, [pin]);

        return <>
            {!!rest.label ? <InputLabel children={rest.label}/> : null}
            {!!rest.description ? <InputDescription children={rest.description}/> : null}
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
            {!rest.formValidation?.valid && rest.formValidation?.notValidMessage ?
                <InputMessage children={rest.formValidation.notValidMessage}/> : null}
        </>
    }

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        const value = input.value

        if (!value.match(/^[0-9a-z]+$/)) {
            input.value = ""
            return
        }
    }

    return <Input
        leftType={"action"}
        type={"text"}
        inputMode={"numeric"}
        maxLength={props.inputLength}
        ref={ref}
        {...rest}
        onChange={event => onChange(event)}
    />
})

export default PinInput