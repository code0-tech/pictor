import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import Card, {CardType} from "./Card";
import Badge from "../badge/Badge";
import Text from "../FontSizes/Text";
import {Colors} from "../../utils/types";
import ButtonGroup from "../button-group/ButtonGroup";

const meta: Meta = {
    title: "Card",
    component: Card,
    argTypes: {
        color: {
            options: Colors,
            control: {type: "radio"}
        },
        variant: {
            options: ['none', 'normal', 'filled', 'outlined'],
            control: {type: 'radio'},
        },
        gradient: {
            type: "boolean"
        },
        gradientPosition: {
            options: ["top-left", "top-right", "bottom-right", "bottom-left"],
            control: {type: 'radio'},
        }
    }
}

export default meta

type CardStory = StoryObj<typeof Card>;

export const Test: CardStory = {
    render: (props) => {
        return <Card variant={props.variant} gradientPosition={props.gradientPosition} gradient={props.gradient} color={props.color} style={{
            width: "400px"
        }}>


            <Card.Section image>
                <img alt={""} width={"100%"}
                     src={"https://repository-images.githubusercontent.com/725262039/8250ad12-4a52-4c89-9b16-6d4186dbb325"}></img>
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
            <Text hierarchy={"tertiary"} size={"md"}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                nonumy eirmod tempor invidunt ut</Text>


        </Card>
    }
    ,
    args: {
        variant: "normal",
        color: "primary",
        gradient: false,
        gradientPosition: "top-right"
    }
}