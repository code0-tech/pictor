import React from "react";
import useForm from "./useForm";
import Input from "./Input";
import Card from "../card/Card";
import Button from "../button/Button";
import {IconKey, IconLogin, IconMail} from "@tabler/icons-react";
import Text from "../text/Text";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import EmailInput, {emailValidation} from "./EmailInput";
import NumberInput from "./NumberInput";
import RadioInput from "./radio/RadioInput";
import CheckboxInput from "./CheckboxInput";
import RadioGroup from "./radio/RadioGroup";
import RadioButton from "./radio/RadioButton";
import CardSection from "../card/CardSection";
import Flex from "../flex/Flex";
import SwitchInput from "./SwitchInput";

export default {
    title: "Form"
}

export const Login = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            email: "nicoq@",
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
                description={"Your Email address for login"}
                left={<IconMail size={13}/>}
                {...inputs.getInputProps("email")}
            />
            <br/>
            <PasswordInput
                placeholder={"Password"}
                label={"Password"}
                description={"Your password for login"}
                left={<IconKey size={13}/>}
                {...inputs.getInputProps("password")}
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

        </form>
    </Card>

}

export const Website = () => {

    return <Card maw={300}>
        <TextInput
            label={"website"}
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
            label={"number"}
            description={"Increase and decrease your number"}
            placeholder={"code0.tech"}
        />
    </Card>

}

export const RadioExample = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            test: "dynamic"
        },
        validate: {
            test: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <form>
        <Card maw={300}>
            <RadioInput
                label={"Runtime"}
                description={"Change runtime mode production version"}
                value={"dynamic"}
                name={"test1"}
                text={"Dynamic"}
                {...inputs.getInputProps("test")}
            />
            <RadioInput
                value={"hybrid"}
                name={"test1"}
                text={"Hybrid"}
                {...inputs.getInputProps("test")}
            />
            <RadioInput
                value={"static"}
                name={"test1"}
                text={"Static"}
                {...inputs.getInputProps("test")}
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
    </form>
}


export const Checkbox = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            test: null
        },
        validate: {
            test: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <form>
        <Card maw={300}>
            <CheckboxInput
                label={"Runtime"}
                description={"Change runtime mode production version"}
                text={"Dynamic"}
                {...inputs.getInputProps("test")}
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
    </form>

}

export const RadioCard = () => {
    const [inputs, validate] = useForm({
        initialValues: {
            test: "dynamic"
        },
        validate: {
            test: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })
    return <RadioGroup {...inputs.getInputProps("test")}>
        {({activeRadio, setActiveRadio}) => {
            return <>
                <Card onClick={() => setActiveRadio("dynamic")} borderColor={activeRadio == "dynamic" ? "info" : "primary"} color={"secondary"}>
                    <CardSection border>
                        <RadioButton name={"test1"} value={"dynamic"}/>
                    </CardSection>
                    <CardSection>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                        ut
                    </CardSection>
                </Card>
                <br/>
                <Card onClick={() => setActiveRadio("hybrid")} borderColor={activeRadio == "hybrid" ? "info" : "primary"} color={"secondary"}>
                    <CardSection border>
                        <RadioButton name={"test1"} value={"hybrid"}/>
                    </CardSection>
                    <CardSection>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                        ut
                    </CardSection>
                </Card>
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
            </>
        }}
    </RadioGroup>
}

export const RadioWithoutInput = () => {
    const [inputs, validate] = useForm({
        initialValues: {
            test: "dynamic"
        },
        validate: {
            test: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })
    return <RadioGroup {...inputs.getInputProps("test")}>
        {({activeRadio, setActiveRadio}) => {
            return <>
                <Flex style={{gap: ".5rem"}}>
                    <Card onClick={() => setActiveRadio("dynamic")} maw={200} borderColor={activeRadio == "dynamic" ? "info" : "primary"} color={"secondary"}>
                        <CardSection>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut
                        </CardSection>
                    </Card>
                    <Card onClick={() => setActiveRadio("hybrid")} maw={200} borderColor={activeRadio == "hybrid" ? "info" : "primary"} color={"secondary"}>
                        <CardSection>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut
                        </CardSection>
                    </Card>
                </Flex>

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
            </>
        }}
    </RadioGroup>
}


export const Switch = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            test: null
        },
        validate: {
            test: (value) => {
                if (!value) return "Error"
                return null
            }
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })


    return <form>
        <Card maw={300}>
            <SwitchInput
                label={"Runtime"}
                description={"Change runtime mode production version"}
                {...inputs.getInputProps("test")}
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
    </form>

}
