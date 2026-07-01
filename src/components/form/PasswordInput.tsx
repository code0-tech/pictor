import React, {RefObject} from "react";
import {Input, InputProps} from "./Input";
import {IconCheck, IconEye, IconX} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {clearInputElement} from "./Input.utils";
import {Flex} from "../flex/Flex";
import {Text} from "../text/Text";

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


    return <>
        <Input
            right={rightAction}
            rightType={"action"}
            type={"password"}
            ref={ref as RefObject<HTMLInputElement>}
            {...(formValidation ? {
                formValidation: {
                    setValue: formValidation.setValue,
                    valid: formValidation.valid,
                }
            } : {})}
            {...rest}
        />
        {
            !formValidation?.valid && (
                <Flex mt={0.7} style={{flexDirection: "column"}}>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {formValidation?.notValidMessage?.includes("1") ? <IconX color={"#D90429"} size={16}/> :
                            <IconCheck color={"#29BF12"} size={16}/>}
                        <Text>Must be at least 8 characters</Text>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {formValidation?.notValidMessage?.includes("2") ? <IconX color={"#D90429"} size={16}/> :
                            <IconCheck color={"#29BF12"} size={16}/>}
                        <Text>Must include a lowercase letter</Text>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {formValidation?.notValidMessage?.includes("3") ? <IconX color={"#D90429"} size={16}/> :
                            <IconCheck color={"#29BF12"} size={16}/>}
                        <Text>Must include an uppercase letter</Text>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {formValidation?.notValidMessage?.includes("4") ? <IconX color={"#D90429"} size={16}/> :
                            <IconCheck color={"#29BF12"} size={16}/>}
                        <Text>Must include a number</Text>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {formValidation?.notValidMessage?.includes("5") ? <IconX color={"#D90429"} size={16}/> :
                            <IconCheck color={"#29BF12"} size={16}/>}
                        <Text>Must include a special character</Text>
                    </Flex>
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
