import {Meta} from "@storybook/react-vite";
import React from "react";
import {Island, useIsland} from "./Island";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Button} from "../button/Button";
import {Text} from "../text/Text";
import {IconCircleCheck, IconCircleX, IconFileSpark} from "@tabler/icons-react";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {FullScreen} from "../fullscreen/FullScreen";
import {Progress} from "../progress/Progress";

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

    const island = useIsland()

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
        <Card color={"secondary"} mt={5}>
            <Button onClick={() => {
                island.addToast({
                    icon: <IconFileSpark color={"#70ffb2"} size={16}/>,
                    message: <Text c={"#70ffb2"}>workflow limit almost reached</Text>,
                    largeContent: <Flex w={"410px"} style={{flexDirection: "column", gap: "0.7rem"}}>
                        <Progress value={30} predictionValue={120} max={100} color={"linear-gradient(to right, #29BF12 0%, #D90429 100%)"}/>
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
                island.addToast({
                    icon: <IconCircleCheck color={"#29BF12"} size={16}/>,
                    message: <Text c={"#29BF12"}>Added license</Text>,
                })
            }}>
                Success
            </Button>
            <Button onClick={() => {
                island.addToast({
                    icon: <IconCircleX color={"#D90429"} size={16}/>,
                    message: <Text c={"#D90429"}>Internal error</Text>,
                })
            }}>
                Error
            </Button>
        </Card>
    </FullScreen>
}
