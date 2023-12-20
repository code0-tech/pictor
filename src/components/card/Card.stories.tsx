import {Meta} from "@storybook/react";
import React from "react";
import Card from "./Card";
import ListGroup from "../list-group/ListGroup";
import {CardFooter} from "./CardFooter";
import ButtonGroup from "../button-group/ButtonGroup";
import Button from "../button/Button";
import Dropdown from "../dropdown/Dropdown";

const meta: Meta = {
    title: "Card",
    component: Card
}

export default meta

export const Test = () => {
    return <Card variant={"secondary"}>
        <Card.Image alt={"Nico Sammito"} src={"https://event.gls-west.de/Nico_Sammito.jpg"}/>
        <Card.Header>
            <Card.Title>Nico Sammito</Card.Title>
            <Card.Subtitle>Co-Founder</Card.Subtitle>
        </Card.Header>
        <ListGroup>
            <Dropdown position={"right"}>
                <Dropdown.Trigger>
                    <ListGroup.Item>
                        Test
                    </ListGroup.Item>
                </Dropdown.Trigger>
                <Dropdown.Menu>
                    <Dropdown.Header>
                        test
                    </Dropdown.Header>
                    Test
                </Dropdown.Menu>
            </Dropdown>

        </ListGroup>
        <CardFooter>
            <ButtonGroup>
                <Button variant={"secondary"}>
                    Button
                </Button>
                <Button variant={"secondary"}>
                    Button
                </Button>
            </ButtonGroup>
        </CardFooter>
    </Card>
}