import {Meta} from "@storybook/react";
import Container from "./Container";
import Card from "../card/Card";
import Text from "../text/Text";
import Badge from "../badge/Badge";
import ButtonGroup from "../button-group/ButtonGroup";
import Button from "../button/Button";
import {IconHeart, IconShare} from "@tabler/icons-react";
import React from "react";
import Row from "../row/Row";
import Col from "../col/Col";
import CardSection from "../card/CardSection";

const meta: Meta = {
    title: "Container",
    component: Container
}

export default meta

export const ContainerWithNews = () => {

    return <Container>
        <Card variant={"outlined"} gradient
              color={"info"} style={{
            maxWidth: "300px"
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
                        <Button color={"error"}>
                            <IconHeart style={{display: "flex"}} size={16}/>
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
    </Container>
}

export const ContainerRowCol = () => {
    return <div style={{background: "#ffffff1a"}}>
        <Container>
            <Row>
                <Col xs={12} lg={4}>
                    <Card gradient variant={"outlined"} color={"info"}>
                        <Text size={"md"}>Heading 1</Text>
                    </Card>
                </Col>
                <Col xs={12} lg={4}>
                    <Card gradient variant={"outlined"} color={"info"}>
                        <Text size={"md"}>Heading 2</Text>
                    </Card>
                </Col>
                <Col xs={12} lg={4}>
                    <Card gradient variant={"outlined"} color={"info"}>
                        <Text size={"md"}>Heading 3</Text>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card gradient variant={"outlined"} color={"info"}>
                        <Text size={"md"}>Heading 4</Text>
                    </Card>
                </Col>
                <Col>
                    <Card gradient variant={"outlined"} color={"info"}>
                        <Text size={"md"}>Heading 5</Text>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
}