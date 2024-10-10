import React from "react";
import useForm from "./useForm";
import Input from "./Input";
import Card from "../card/Card";
import Button from "../button/Button";
import {IconEye, IconMail} from "@tabler/icons-react";
import Select from "../select/Select";
import {Text} from "../../index";

export default {
    title: "Input",
    component: Input
}

export const Test = () => {

    const [inputs, validate] = useForm({
        initialValues: {
            test: null
        },
        validate: {
            test: (value) => {
                if (!value) return "Test is required"
                return null
            }
        }
    })

    return <Card>
        <form>
            <Input
                right={<IconMail size={13}/>}
                left={
                    <Button color={"primary"}><IconEye size={13}/></Button>
                }
                leftType={"action"}
                rightType={"icon"}
                label={"Email"}
                description={"Provide a valid email address"}
                type={"text"}
                placeholder={"test"}
                required
                {...(inputs.test)}/>
            <br/>
            <Input
                right={
                    <Select placement={"bottom-start"}>
                        <Select.Button/>
                        <Select.Popover>
                            <Select.Group>
                                <Select.GroupLabel>Fruits</Select.GroupLabel>
                                <Select.Item value={"Apple"}/>
                                <Select.Item value={"Banana"}/>
                                <Select.Item disabled value={"Grape"}/>
                                <Select.Item value={"Orange"}/>
                            </Select.Group>

                        </Select.Popover>
                    </Select>
                }
                rightType={"action"}
                label={"Email"}
                description={"Provide a valid email address"}
                type={"text"}
                placeholder={"test"}
                required
                {...(inputs.test)}/>
            <br/>
            <Button color={"secondary"} onClick={validate}>Test form</Button>
        </form>
    </Card>

}