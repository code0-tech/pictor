import Button from "../button/Button";
import {StoryObj} from "@storybook/react";
import ButtonGroup from "../button-group/ButtonGroup";
import {CardStack} from "./CardStack";
import React from "react";
import Card from "../card/Card";
import Text from "../FontSizes/Text";
import Badge from "../badge/Badge";
import {IconHeart, IconHeartFilled, IconShare} from "@tabler/icons-react";

const meta = {
    title: "CardStack",
    component: CardStack,
}

export default meta

type CardStackStoryType = StoryObj<typeof ButtonGroup>;

export const Stack: CardStackStoryType = {
    render: (args) => {
        return <CardStack>
            <Card style={{
                width: "50vw",
                maxWidth: "350px"
            }}>


                <Card.Section image border>
                    <img alt={""} width={"100%"}
                         src={"https://repository-images.githubusercontent.com/725262039/8250ad12-4a52-4c89-9b16-6d4186dbb325"}></img>
                </Card.Section>
                <Card.Section>
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
                            <Button color={"primary"}>
                                <IconShare style={{display: "flex"}} size={16}/>
                            </Button>
                            <Button color={"primary"}>
                                <IconShare style={{display: "flex"}} size={16}/>
                            </Button>
                        </ButtonGroup>
                    </div>
                </Card.Section>
                <Card.Section border>
                    <Text hierarchy={"tertiary"} size={"md"}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                        diam
                        nonumy eirmod tempor invidunt ut</Text>
                </Card.Section>

            </Card>
            <Card color={"success"} style={{
                width: "50vw",
                maxWidth: "350px"
            }}>


                <Card.Section image border>
                    <img alt={""} width={"100%"}
                         src={"https://repository-images.githubusercontent.com/725262039/8250ad12-4a52-4c89-9b16-6d4186dbb325"}></img>
                </Card.Section>
                <Card.Section>
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
                            <Button color={"primary"}>
                                <IconShare style={{display: "flex"}} size={16}/>
                            </Button>
                            <Button color={"primary"}>
                                <IconShare style={{display: "flex"}} size={16}/>
                            </Button>
                        </ButtonGroup>
                    </div>
                </Card.Section>
                <Card.Section border>
                    <Text hierarchy={"tertiary"} size={"md"}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                        diam
                        nonumy eirmod tempor invidunt ut</Text>
                </Card.Section>

            </Card>
            <Card color={"info"} style={{
                width: "50vw",
                maxWidth: "350px"
            }}>


                <Card.Section image border>
                    <img alt={""} width={"100%"}
                         src={"https://repository-images.githubusercontent.com/725262039/8250ad12-4a52-4c89-9b16-6d4186dbb325"}></img>
                </Card.Section>
                <Card.Section>
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
                            <Button color={"primary"}>
                                <IconShare style={{display: "flex"}} size={16}/>
                            </Button>
                            <Button color={"primary"}>
                                <IconShare style={{display: "flex"}} size={16}/>
                            </Button>
                        </ButtonGroup>
                    </div>
                </Card.Section>
                <Card.Section border>
                    <Text hierarchy={"tertiary"} size={"md"}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                        diam
                        nonumy eirmod tempor invidunt ut</Text>
                </Card.Section>

            </Card>

        </CardStack>

    }
}