import React from "react";
import useForm from "./useForm";
import Input from "./Input";
import Card from "../card/Card";
import Button from "../button/Button";
import {IconEye, IconKey, IconLogin, IconMail, IconMinus, IconPlus, IconX} from "@tabler/icons-react";
import ButtonGroup from "../button-group/ButtonGroup";
import Text from "../Text/Text";

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
            <Input
                placeholder={"Email"}
                label={"Email"}
                type={"email"}
                description={"Your Email address for login"}
                left={<IconMail size={13}/>}
                right={<Button><IconX size={13}/></Button>}
                {...inputs.email}
            />
            <br/>
            <Input
                placeholder={"Password"}
                label={"Password"}
                type={"password"}
                description={"Your password for login"}
                left={<IconKey size={13}/>}
                right={<ButtonGroup>
                    <Button><IconEye size={13}/></Button>
                    <Button><IconX size={13}/></Button>
                </ButtonGroup>}
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

export const WebsiteInput = () => {

    return <Card maw={300}>
        <Input
            label={"website"}
            description={"Your website for linking"}
            type={"text"}
            placeholder={"code0.tech"}
            left={"https://"}
            leftType={"placeholder"}
            right={<Button><IconX size={13}/></Button>}
        />
    </Card>

}

export const NumberInput = () => {

    return <Card maw={300}>
        <Input
            label={"number"}
            description={"Increase and decrease your number"}
            type={"number"}
            placeholder={"code0.tech"}
            left={<Button color={"secondary"}><IconMinus size={13}/></Button>}
            leftType={"action"}
            right={<Button color={"secondary"}><IconPlus size={13}/></Button>}
        />
    </Card>

}