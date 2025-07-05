import React from "react";
import useForm from "./useForm";
import Card from "../card/Card";
import Button from "../button/Button";
import {IconKey, IconLogin, IconMail} from "@tabler/icons-react";
import Text from "../text/Text";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import EmailInput, {emailValidation} from "./EmailInput";
import NumberInput from "./NumberInput";
import SwitchInput from "./SwitchInput";
import {PinInput, PinInputField, PinInputHiddenField} from "./PinInput";
import {CheckboxInput} from "./CheckboxInput";
import {RadioGroup} from "./RadioGroup";
import {RadioInput} from "./RadioInput";

export default {
    title: "Form"
}

export const Login = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            email: "nicoq@de.de",
            password: null,
        },
        validate: {
            email: (value) => {
                if (!value) return "Email is required"
                if (!emailValidation(value)) return "Please provide a valid email"
                return null
            },
            password: (value) => {
                if (!value) return "Password is required"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <Card color={"primary"} maw={300}>
        <Text size={"xl"} display={"block"} hierarchy={"primary"}>Login</Text>
        <br/>
        <Text size={"sm"} display={"block"}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua.
        </Text>
        <br/>
        <form>
            <EmailInput
                placeholder={"Email"}
                title={"Email"}
                description={"Your Email address for login"}
                left={<IconMail size={13}/>}
                {...inputs.getInputProps("email")}
            />
            <br/>
            <PasswordInput
                placeholder={"Password"}
                title={"Password"}
                description={"Your password for login"}
                left={<IconKey size={13}/>}
                {...inputs.getInputProps("password")}
            />
            <br/>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: ".75rem",
            }}>
                <Button w={"100%"} color={"secondary"} variant={"outlined"} onClick={validate}>
                    Login
                </Button>

            </div>

        </form>
    </Card>

}

export const Website = () => {

    return <Card maw={300}>
        <TextInput
            title={"website"}
            description={"Your website for linking"}
            clearable
            placeholder={"code0.tech"}
            left={"https://"}
            leftType={"placeholder"}
        />
    </Card>

}

export const Number = () => {

    return <Card maw={300}>
        <NumberInput
            title={"number"}
            description={"Increase and decrease your number"}
            placeholder={"code0.tech"}
        />
    </Card>

}

export const RadioExample = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            radio: null
        },
        validate: {
            radio: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <Card maw={300}>
            <RadioGroup title={"Runtime"}
                        description={"Change runtime mode production version"}
                        {...inputs.getInputProps("radio")}>
                <RadioInput
                    value={"dynamic"}
                    label={"Dynamic"}
                />
                <RadioInput
                    value={"hybrid"}
                    label={"Hybrid"}
                />
                <RadioInput
                    value={"static"}
                    label={"Static"}
                />
            </RadioGroup>
            <br/>
            <div style={{
                display: "flex",
                justifyContent: "end"
            }}>
                <Button color={"info"} onClick={validate}>
                    <IconLogin size={13}/>
                    Login
                </Button>

            </div>
        </Card>

}


export const Checkbox = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            checkbox: true
        },
        validate: {
            checkbox: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <Card maw={300}>

        <CheckboxInput
            title={"Runtime"}
            description={"Change runtime mode production version"}
            label={"Dynamic"}
            {...inputs.getInputProps("checkbox")}
        />

        <br/>
        <div style={{
            display: "flex",
            justifyContent: "end"
        }}>
            <Button color={"info"} onClick={validate}>
                <IconLogin size={13}/>
                Login
            </Button>

        </div>
    </Card>


}


export const Switch = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            switch: true
        },
        validate: {
            switch: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <Card maw={300}>
            <SwitchInput
                title={"Runtime"}
                description={"Change runtime mode production version"}
                {...inputs.getInputProps("switch")}
            />
            <br/>
            <div style={{
                display: "flex",
                justifyContent: "end"
            }}>
                <Button color={"info"} onClick={validate}>
                    <IconLogin size={13}/>
                    Login
                </Button>

            </div>
        </Card>

}


export const PinInputExample = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            pinInput: null
        },
        validate: {
            pinInput: (value: string | null) => {
                if (!value || value.length != 6) return "Please type or paste your 6-digit code"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return <>
        <Card maw={300}>
            <PinInput title={"OTP"}
                      description={"Paste or type your 6-digit code"} {...inputs.getInputProps("pinInput")}>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputHiddenField/>
            </PinInput>
            <div style={{
                display: "flex",
                justifyContent: "end",
                marginTop: ".7rem"
            }}>
                <Button color={"secondary"} onClick={validate}>
                    <IconLogin size={13}/>
                    Login
                </Button>

            </div>
        </Card>
    </>

}