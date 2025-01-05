import {Meta, StoryObj} from "@storybook/react";
import React, {useState} from "react";
import Card from "./Card";
import Badge from "../badge/Badge";
import Text from "../text/Text";
import {Colors} from "../../utils/types";
import ButtonGroup from "../button-group/ButtonGroup";
import Button from "../button/Button";
import {IconHeart, IconHeartFilled, IconShare} from "@tabler/icons-react";
import CardSection from "./CardSection";

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
        outline: {
            type: "boolean"
        }
    }
}

export default meta

type CardStory = StoryObj<typeof Card>;

export const CardNews: CardStory = {
    render: (props) => {

        const [heart, setHeart] = useState(false)

        return <Card outline={props.outline} variant={props.variant} gradient={props.gradient}
                     color={props.color} style={{
            width: "50vw",
            maxWidth: "350px"
        }}>


            <CardSection image border>
                <img alt={""} width={"100%"}
                     src={"https://repository-images.githubusercontent.com/725262039/8250ad12-4a52-4c89-9b16-6d4186dbb325"}></img>
            </CardSection>
            <CardSection>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <Text size={"lg"} hierarchy={"primary"} style={{display: "block", marginBottom: ".25rem"}}>A
                            great backend story</Text>
                        <Badge>by Niklas van Schrick</Badge>
                    </div>
                    <ButtonGroup>
                        <Button color={"error"} onClick={() => setHeart(prevState => !prevState)}>
                            {heart ? <div style={{display: "flex", alignItems: "center"}}>
                                <IconHeartFilled style={{display: "flex", marginRight: ".5rem"}} size={16}/>
                                <Badge color={"info"}>500</Badge>
                            </div> : <div style={{display: "flex", alignItems: "center"}}>
                                <IconHeart style={{display: "flex", marginRight: ".5rem"}} size={16}/>
                                <Badge color={"info"}>499</Badge>
                            </div>}
                        </Button>
                        <Button color={"primary"}>
                            <IconShare style={{display: "flex"}} size={16}/>
                        </Button>
                    </ButtonGroup>
                </div>
            </CardSection>
            <CardSection border>
                <Text hierarchy={"tertiary"} size={"md"}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam
                    nonumy eirmod tempor invidunt ut</Text>
            </CardSection>

        </Card>
    }
    ,
    args: {
        variant: "normal",
        color: "secondary",
        outline: false,
        gradient: true,
    }
}