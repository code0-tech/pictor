import React from "react";
import useForm from "./useForm";
import Input from "./Input";
import Card from "../card/Card";
import Button from "../button/Button";
import {IconKey, IconLogin, IconMail} from "@tabler/icons-react";
import Text from "../Text/Text";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import EmailInput, {emailValidation} from "./EmailInput";
import NumberInput from "./NumberInput";

export default {
    title: "Input",
    component: Input
}

export const Login = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            email: null,
            password: null,
            checkbox: true
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

    return <Card maw={300}>
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
                label={"Email"}
                type={"email"}
                description={"Your Email address for login"}
                left={<IconMail size={13}/>}
                {...inputs.email}
            />
            <br/>
            <PasswordInput
                placeholder={"Password"}
                label={"Password"}
                description={"Your password for login"}
                left={<IconKey size={13}/>}
                {...inputs.password}
            />
            <br/>
            <div style={{
                display: "flex",
                justifyContent:"end"
            }}>
                <Button color={"info"} onClick={validate}>
                    <IconLogin size={13}/>
                    Login
                </Button>

            </div>

        </form>
    </Card>

}

export const Website = () => {

    return <Card maw={300}>
        <TextInput
            label={"website"}
            description={"Your website for linking"}
            type={"text"}
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
            label={"number"}
            description={"Increase and decrease your number"}
            placeholder={"code0.tech"}
        />
    </Card>

}