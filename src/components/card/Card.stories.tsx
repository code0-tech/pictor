import {Meta} from "@storybook/react";
import React from "react";
import Card from "./Card";
import Badge from "../badge/Badge";
import Text from "../FontSizes/Text";

const meta: Meta = {
    title: "Card",
    component: Card
}

export default meta

export const Test = () => {
    return <Card style={{
        width: "400px"
    }} >


        <Card.Section image>
            <img alt={""} width={"100%"} src={"https://repository-images.githubusercontent.com/725262039/8250ad12-4a52-4c89-9b16-6d4186dbb325"}></img>
        </Card.Section>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <Text size={"lg"} hierarchy={"primary"}>Titel</Text>
            <Badge>26.02.24 22:06</Badge>
        </div>
        <br/>
        <Text hierarchy={"tertiary"} size={"md"}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut</Text>



    </Card>
}