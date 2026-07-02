import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconEye, IconX} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {clearInputElement} from "./Input.utils";
import {Flex} from "../flex/Flex";
import {Progress} from "../progress/Progress";
import {InputMessage} from "./InputMessage";

interface PasswordInputProps extends Omit<InputProps<string | null>, "wrapperComponent" | "type"> {
    clearable?: boolean,
    visible?: boolean
}


export const PasswordInput: React.ForwardRefExoticComponent<PasswordInputProps> = React.forwardRef((props, ref: RefObject<HTMLElement>) => {

    ref = ref || React.useRef<HTMLInputElement>(null)

    const {
        clearable = true,
        visible = true,
        right,
        formValidation,
        ...rest
    } = props

    const toClearable = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearInputElement(ref.current)
        event.stopPropagation()
        event.preventDefault()
        return false
    }

    const toVisible = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (ref.current instanceof HTMLInputElement) {
            if (ref.current.type === "password") ref.current.type = "text"
            else if (ref.current.type === "text") ref.current.type = "password"
        }
        event.stopPropagation()
        event.preventDefault()
        return false
    }

    const rightAction = [right]
    visible && rightAction.push(<Button variant={"none"} onClick={(event) => toVisible(event)}><IconEye
        size={13}/></Button>)
    clearable && rightAction.push(<Button variant={"none"} onClick={(event) => toClearable(event)}><IconX
        size={13}/></Button>)


    const notValidMessage = formValidation?.notValidMessage ?? ""
    const usesPasswordValidation = /^[1-5]+$/.test(notValidMessage)
    const failedRules = notValidMessage.length
    const passedRules = Math.max(0, 5 - failedRules)
    const strengthValue = (passedRules / 5) * 100

    return <>
        <Input
            right={rightAction}
            rightType={"action"}
            type={"password"}
            ref={ref as RefObject<HTMLInputElement>}
            {...(formValidation ? {
                formValidation: usesPasswordValidation ? {
                    setValue: formValidation.setValue,
                    valid: formValidation.valid,
                } : formValidation
            } : {})}
            {...rest}
        />
        {
            usesPasswordValidation && !formValidation?.valid && (
                <Flex mt={0.7} style={{flexDirection: "column"}}>
                    <Progress value={strengthValue} max={100}
                              color={"linear-gradient(to right, #D90429 0%, #29BF12 100%)"}/>
                    {(() => {
                        const nextRule = ["2", "3", "4", "5", "1"].find(rule => notValidMessage.includes(rule))
                        if (!nextRule) return null
                        const label = {
                            "1": "Must be at least 8 characters",
                            "2": "Must include a lowercase letter",
                            "3": "Must include an uppercase letter",
                            "4": "Must include a number",
                            "5": "Must include a special character",
                        }[nextRule]
                        return <InputMessage>
                            {label as string}
                        </InputMessage>
                    })()}
                </Flex>
            )
        }
    </>

})

export const passwordValidation = (value: string | null): string | null => {
    if (!value) return "12345"
    let message: null | string = null
    if (value.length < 8) message = (message ?? "") + "1"
    if (!/[a-z]/.test(value)) message = (message ?? "") + "2"
    if (!/[A-Z]/.test(value)) message = (message ?? "") + "3"
    if (!/[0-9]/.test(value)) message = (message ?? "") + "4"
    if (!/[^A-Za-z0-9]/.test(value)) message = (message ?? "") + "5"
    return message
}
