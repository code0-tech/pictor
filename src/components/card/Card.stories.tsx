import {Meta, StoryObj} from "@storybook/react-vite";
import React from "react";
import {Card} from "./Card";
import {Text} from "../text/Text";
import {Colors} from "../../utils/types";
import {Button} from "../button/Button";
import {IconBuilding, IconGitBranch, IconServer, IconUserCog} from "@tabler/icons-react";
import {AuroraBackground} from "../aurora/Aurora";
import {Spacing} from "../spacing/Spacing";
import {Flex} from "../flex/Flex";
import {Row} from "../row/Row";
import {Col} from "../col/Col";
import {Container} from "../container/Container";
import {Badge} from "../badge/Badge";

const meta: Meta = {
    title: "Card",
    component: Card,
    argTypes: {
        color: {
            options: Colors,
            control: {type: "radio"}
        },
        borderColor: {
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
        gradientColor: {
            options: Colors,
            control: {type: "radio"}
        },
        outline: {
            type: "boolean"
        },
        outlineColor: {
            options: Colors,
            control: {type: "radio"}
        },
        dashed: {
            type: "boolean"
        }
    }
}

export default meta

type CardStory = StoryObj<typeof Card>;

export const CardNews = () => {
    return <Container>
        <Row>
            <Col>
                <Card color={"secondary"}>
                    <Card mt={-1.3} mx={-1.3} color={"primary"} style={{borderWidth: "3px"}}>
                        <Flex align={"center"} justify={"space-between"} style={{gap: "1.3rem"}}>
                            <Text size={"xl"} hierarchy={"tertiary"}>Team</Text>
                            <Badge color={"error"} border style={{zIndex: 1}}>
                                <Text size={"md"} hierarchy={"tertiary"} style={{color: "inherit"}}>-27%</Text>
                            </Badge>
                        </Flex>
                        <Spacing spacing={"md"}/>
                        <Flex align={"center"} justify={"space-between"} style={{gap: "1.3rem"}}>
                            <Text size={"xl"} style={{fontSize: "2rem"}} hierarchy={"primary"}>12,95€</Text>
                            <Text size={"md"} hierarchy={"tertiary"}>per user / month billed annually</Text>
                        </Flex>
                        <Spacing spacing={"md"}/>
                        <Button w={"100%"} color={"primary"}>Get started now</Button>
                    </Card>
                    <Spacing spacing={"md"}/>
                    <Flex style={{gap: "0.7rem", flexDirection: "column"}}>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconBuilding size={16}/>
                            Manage projects inside organizations
                        </Text>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconUserCog size={16}/>
                            Advanced role management
                        </Text>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconGitBranch size={16}/>
                            Unlimited flows
                        </Text>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconServer size={16}/>
                            10.000 runtime minutes per month
                        </Text>
                        <Text size={"sm"} hierarchy={"tertiary"} display={"flex"} align={"center"}
                              style={{gap: "0.7rem"}}>
                            See all the features
                        </Text>
                    </Flex>
                    <AuroraBackground/>
                </Card>
            </Col>
            <Col>
                <Card>
                    <Card mt={-1.3} mx={-1.3} color={"primary"} style={{borderWidth: "3px"}}>
                        <Text size={"xl"} hierarchy={"tertiary"}>Team</Text>
                        <Spacing spacing={"md"}/>
                        <Flex align={"center"} justify={"space-between"} style={{gap: "1.3rem"}}>
                            <Text size={"xl"} style={{fontSize: "2rem"}} hierarchy={"primary"}>17,95€</Text>
                            <Text size={"md"} hierarchy={"tertiary"}>per user / month billed monthly</Text>
                        </Flex>
                        <Spacing spacing={"md"}/>
                        <Button w={"100%"} color={"primary"}>Get started now</Button>
                    </Card>
                    <Spacing spacing={"md"}/>
                    <Flex style={{gap: "0.7rem", flexDirection: "column"}}>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconBuilding size={16}/>
                            Manage projects inside organizations
                        </Text>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconUserCog size={16}/>
                            Advanced role management
                        </Text>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconGitBranch size={16}/>
                            Unlimited flows
                        </Text>
                        <Text size={"md"} display={"flex"} align={"center"} style={{gap: "0.7rem"}}>
                            <IconServer size={16}/>
                            10.000 runtime minutes per month
                        </Text>
                        <Text size={"sm"} hierarchy={"tertiary"} display={"flex"} align={"center"}
                              style={{gap: "0.7rem"}}>
                            See all the features
                        </Text>
                    </Flex>
                </Card>
            </Col>
            <Col>
                {" "}
            </Col>
        </Row>
    </Container>
}