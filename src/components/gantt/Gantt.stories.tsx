import {Meta} from "@storybook/react-vite";
import {Gantt, getRelativeValue} from "./Gantt";
import React from "react";
import {Container} from "../container/Container";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {
    IconArrowRampRight2,
    IconBrandDiscord,
    IconBrandTeams,
    IconDatabase,
    IconTextGrammar
} from "@tabler/icons-react";
import {Text} from "../text/Text";
import {hashToColor, withAlpha} from "../../utils";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {Spacing} from "../spacing/Spacing";
import {Editor} from "../editor/Editor";

export default {
    title: "Gantt",
    component: Gantt
} as Meta

export const GanttExample = () => {
    return <Container pos={"relative"} h={"300px"}>
        <Gantt step={0.1} stepWidth={"50px"} rowHeight={"50px"} items={[
            {
                id: "0",
                start: 0,
                end: 190_000,
                data: {
                    icon: IconBrandDiscord,
                    displayMessage: "On Discord channel message send"
                }
            },
            {
                id: "1",
                start: 0,
                end: 200,
                data: {
                    icon: IconTextGrammar,
                    displayMessage: "Contains sensitive words?"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "2",
                start: 199,
                end: 300,
                data: {
                    icon: IconArrowRampRight2,
                    displayMessage: "If"
                }
            },
            {
                id: "3",
                start: 300,
                end: 50_000,
                data: {
                    icon: IconBrandDiscord,
                    displayMessage: "Ban user"
                }
            },
            {
                id: "4",
                start: 49_000,
                end: 110_000,
                data: {
                    icon: IconBrandDiscord,
                    displayMessage: "Send ban message in channel",
                    parameters: [{
                        name: "Message content",
                        value: "The user @test_user has been banned for sending a message containing sensitive words.",
                    }],
                    result: {
                        http_status_code: 204,
                        payload: {},
                        headers: {}
                    }
                }
            },
            {
                id: "5",
                start: 110_000,
                end: 130_000,
                data: {
                    icon: IconDatabase,
                    displayMessage: "Save ban in own database"
                }
            },
            {
                id: "6",
                start: 110_000,
                end: 190_000,
                data: {
                    icon: IconBrandTeams,
                    displayMessage: "Notify team members"
                }
            }
        ]} start={0}>
            {(item) => item.type === "group" ? (
                <Flex align={"center"} justify={"start"} w={"100%"} h={"100%"} style={{cursor: "pointer"}}
                      onClick={() => {
                          const element = document.getElementById(`group-target-${item.data.displayMessage}`)
                          element?.scrollIntoView({behavior: "smooth"})
                      }}>
                    <Card color={"secondary"}
                          paddingSize={"xs"}
                          p={"0"}
                          h={"31px"}
                          style={{
                              background: "transparent",
                              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${withAlpha(item.data.color, 0.25)} 4px, ${withAlpha(item.data.color, 0.25)} 4px)`
                          }}
                          w={"100%"}>
                        <></>
                    </Card>
                </Flex>
            ) : (
                <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                        <Flex align={"center"} justify={"start"} w={"100%"} h={"100%"} style={{cursor: "pointer"}}>
                            <Card color={"secondary"}
                                  paddingSize={"xs"}
                                  py={"0.35"}
                                  w={"100%"}>
                                <Flex align={"center"} w={"100%"} pos={"relative"} justify={"space-between"}
                                      style={{gap: "0.35rem", textWrap: "nowrap", overflow: "hidden"}}>
                                    <Flex align={"center"} maw={"70%"} pos={"relative"} justify={"start"}
                                          style={{gap: "0.35rem"}}>
                                        {item.data.icon && React.createElement(item.data.icon, {
                                            color: hashToColor(item.id),
                                            size: 16,
                                            style: {minWidth: "16px", minHeight: "16px"}
                                        })}
                                        <Text size={"md"} style={{overflow: "hidden", position: "relative"}}>
                                            {item.data.displayMessage}
                                        </Text>
                                    </Flex>
                                    <Text size={"xs"} hierarchy={"tertiary"}>
                                        {getRelativeValue(item.end - item.start)}
                                    </Text>
                                </Flex>
                            </Card>
                        </Flex>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent forceMount sideOffset={8} align={"start"}
                                        maw={"300px"}>
                            <Flex align={"start"} pos={"relative"} justify={"start"} style={{gap: "0.35rem"}}>
                                {item.data.icon && React.createElement(item.data.icon, {
                                    color: hashToColor(item.id),
                                    size: 16,
                                    style: {minWidth: "16px", minHeight: "16px", marginTop: "2px"}
                                })}
                                <Text size={"md"} style={{overflow: "hidden", position: "relative"}}>
                                    {item.data.displayMessage}
                                </Text>
                            </Flex>
                            <Spacing spacing={"xs"}/>
                            <table style={{width: '100%'}}>
                                <tbody>
                                <tr>
                                    <td>
                                        <Text size={"md"} hierarchy={"tertiary"}>
                                            Start time
                                        </Text>
                                    </td>
                                    <td style={{width: "1px"}}>
                                        <Text size={"sm"} hierarchy={"tertiary"}>
                                            {getRelativeValue(item.start)}
                                        </Text>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Text size={"md"} hierarchy={"tertiary"}>
                                            End time
                                        </Text>
                                    </td>
                                    <td style={{width: "1px"}}>
                                        <Text size={"sm"} hierarchy={"tertiary"}>
                                            {getRelativeValue(item.end)}
                                        </Text>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Text size={"md"} hierarchy={"tertiary"}>
                                            Duration
                                        </Text>
                                    </td>
                                    <td style={{width: "1px"}}>
                                        <Text size={"sm"} hierarchy={"tertiary"}>
                                            {getRelativeValue(item.end - item.start)}
                                        </Text>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <Spacing spacing={"xs"}/>

                            <>
                                <Text size={"md"}>
                                    Parameters
                                </Text>
                                {item.data.parameters?.map((item: any, index: number) => (
                                    <div key={item.name}>
                                        <Text size={"sm"} hierarchy={"tertiary"}>
                                            {item.name}
                                        </Text>
                                        <Editor readonly showTooltips={false} language={"json"}
                                                initialValue={item.value}
                                                basicSetup={{
                                                    highlightActiveLine: false,
                                                    highlightActiveLineGutter: false,
                                                }}/>
                                    </div>
                                ))}
                            </>

                            <Spacing spacing={"xs"}/>
                            {
                                item.data.result && (
                                    <div>
                                        <Text size={"md"}>
                                            Result
                                        </Text>
                                        <Editor readonly showTooltips={false} language={"json"}
                                                initialValue={item.data.result}
                                                basicSetup={{
                                                    highlightActiveLine: false,
                                                    highlightActiveLineGutter: false,
                                                }}/>
                                    </div>
                                )
                            }
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            )}
        </Gantt>
    </Container>
}