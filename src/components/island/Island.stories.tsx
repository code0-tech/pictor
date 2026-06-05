import {Meta} from "@storybook/react-vite";
import React from "react";
import {Island} from "./Island";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Button} from "../button/Button";
import {Text} from "../text/Text";
import {IconCircleCheck, IconCircleX} from "@tabler/icons-react";
import {Flex} from "../flex/Flex";
import {FullScreen} from "../fullscreen/FullScreen";
import {Progress} from "../progress/Progress";
import {addIslandNotification} from "./Island.hook";

export default {
    title: "Island",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
} as Meta

export const IslandExample = () => {

    return <FullScreen>
        <Flex pos={"fixed"} top={"1rem"} left={"0"} w={"100%"} justify={"center"} style={{zIndex: 9999}}>
            <Island>
                <ButtonGroup color={"primary"} bg={"transparent"} style={{boxShadow: "none"}}>
                    <Button paddingSize={"xxs"} variant={"none"}>
                        <Text>Home</Text>
                    </Button>
                    <Button paddingSize={"xxs"} variant={"none"}>
                        <Text>Organizations</Text>
                    </Button>
                    <Button paddingSize={"xxs"} variant={"none"}>
                        <Text>Projects</Text>
                    </Button>
                </ButtonGroup>
            </Island>
        </Flex>
        <Flex pos={"fixed"} bottom={"1rem"} left={"0"} w={"100%"} justify={"center"} style={{zIndex: 9999}}>
            <ButtonGroup color={"primary"}>
                <Button onClick={() => {
                    addIslandNotification({
                        icon: <Text c={"#70ffb2"}>Approaching limit</Text>,
                        message: <Progress w={"100px"} h={"7.5px"} value={30} predictionValue={75} max={100}
                                           color={"#70ffb2"}/>,
                        content: <Flex w={"100%"} style={{flexDirection: "column", gap: "0.7rem"}}>
                            <Text>
                                You used 50% of your available workflow executions and will used 75% until its reseted.
                            </Text>
                            <Flex align={"center"} style={{gap: "0.7rem"}}>
                                <Button w={"100%"}>
                                    Add new license
                                </Button>
                                <Button w={"100%"}>
                                    Buy new license
                                </Button>
                            </Flex>
                        </Flex>
                    })
                }}>
                    Info
                </Button>
                <Button onClick={() => {
                    addIslandNotification({
                        icon: <IconCircleCheck color={"#29BF12"} size={16}/>,
                        message: <Text c={"#29BF12"}>Added license</Text>,
                    })
                }}>
                    Success
                </Button>
                <Button onClick={() => {
                    addIslandNotification({
                        icon: <IconCircleX color={"#D90429"} size={16}/>,
                        message: <Text c={"#D90429"}>Internal error</Text>,
                        index: 1
                    })
                }}>
                    Error
                </Button>
            </ButtonGroup>
        </Flex>
    </FullScreen>
}
