import {Meta} from "@storybook/react";
import React from "react";
import Card from "./Card";
import ListGroup from "../list-group/ListGroup";

const meta: Meta = {
    title: "Card",
    component: Card
}

export default meta

export const Test = () => {
    return <Card>
        <Card.Image src={"https://event.gls-west.de/Nico_Sammito.jpg"}/>
        <Card.Header>
            <Card.Title>Nico Sammito</Card.Title>
            <Card.Subtitle>Co-Founder</Card.Subtitle>
        </Card.Header>
    </Card>
}