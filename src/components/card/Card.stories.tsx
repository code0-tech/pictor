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
        <ListGroup>
            <ListGroup.Item>
                test
            </ListGroup.Item>
            <ListGroup.Item>
                test
            </ListGroup.Item>
            <ListGroup.Item>
                test
            </ListGroup.Item>
        </ListGroup>
        <Card.Image src={"https://event.gls-west.de/Nico_Sammito.jpg"}/>
        <ListGroup>
            <ListGroup.Item>
                test
            </ListGroup.Item>
            <ListGroup.Item>
                test
            </ListGroup.Item>
            <ListGroup.Item>
                test
            </ListGroup.Item>
        </ListGroup>
    </Card>
}