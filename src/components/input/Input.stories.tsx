import React from "react";
import Input from "./Input";
import {IconMail} from "@tabler/icons-react";

export default {
    title: "Input",
    component: Input
};

export const Mail = () => <Input>
    <Input.Label>e-mail</Input.Label>
    <Input.Control placeholder={"name@mail.com"} onFocus={event => {
        console.log("sdsd")
    }}/>
    <Input.Desc>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</Input.Desc>
</Input>

export const Disabled = () => <Input disabled>
    <Input.Control placeholder={"Your Mail"}>
        <Input.Control.Icon><IconMail/></Input.Control.Icon>
    </Input.Control>
    <Input.Desc>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</Input.Desc>
</Input>

export const NotValid = () => <Input valid={false}>
    <Input.Control placeholder={"Your E-Mail"}>
        <Input.Control.Icon><IconMail/></Input.Control.Icon>
        <Input.Control.Message>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Input.Control.Message>
    </Input.Control>
    <Input.Desc>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</Input.Desc>
</Input>

export const Valid = () => <Input valid>
    <Input.Control placeholder={"Your E-Mail"}>
        <Input.Control.Message>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</Input.Control.Message>
    </Input.Control>
    <Input.Desc>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam</Input.Desc>
</Input>