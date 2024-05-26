import {Meta} from "@storybook/react";
import React from "react";
import DScreen from "./DScreen";
import Badge from "../badge/Badge";
import {
    IconApi,
    IconDatabase,
    IconHierarchy3,
    IconLayoutNavbarCollapse,
    IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse,
    IconSettings,
    IconTicket
} from "@tabler/icons-react";
import Text from "../Text/Text";
import DFullScreen from "../d-fullscreen/DFullScreen";
import Button from "../button/Button";

const meta: Meta = {
    title: "Dashboard Screen",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
    component: DScreen
}

export const DashboardScreenExample = () => {
    return <DFullScreen>
        <DScreen>
            <DScreen.VBar.Top>
                <DScreen.BarContent mediaMaxWidth={800}>
                    <Badge>Home</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>...</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>Sagittarius</Badge>
                </DScreen.BarContent>
                <DScreen.BarContent mediaMinWidth={800}>
                    <Badge>Home</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>Organisations</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>Code0</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>Projects</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>Sagittarius</Badge>
                </DScreen.BarContent>
            </DScreen.VBar.Top>
            <DScreen.VBar.Bottom>
                <DScreen.BarContent>
                    <Badge>Test</Badge>
                </DScreen.BarContent>
            </DScreen.VBar.Bottom>
            <DScreen.HBar.Left>
                <DScreen.BarContent justify={"space-between"}>
                    <div style={{display: "flex", flexDirection: "column", gap: ".5rem"}}>
                        <DScreen.Item>
                            <IconHierarchy3 size={12}/>
                            Flows
                        </DScreen.Item>
                        <DScreen.Item>
                            <IconTicket size={12}/>
                            Issues
                        </DScreen.Item>
                        <DScreen.Item>
                            <IconDatabase size={12}/>
                            Database
                        </DScreen.Item>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", gap: ".5rem"}}>
                        <DScreen.Item>
                            <IconSettings size={12}/>
                            Settings
                        </DScreen.Item>
                    </div>
                </DScreen.BarContent>
            </DScreen.HBar.Left>
            <DScreen.HBar.Right>
                <DScreen.BarContent>
                    <DScreen.Item>
                        Docs
                    </DScreen.Item>
                </DScreen.BarContent>
            </DScreen.HBar.Right>
            <DScreen.Content>
                <DScreen>
                    <DScreen.HBar.Left>
                        {(collapsed, collapse) => {
                            return <>
                                <DScreen.CollapsableItem pos={"absolute"} right={"-17px"} top={"10%"} onClick={collapse}>
                                    {collapsed ? <IconLayoutSidebarRightCollapse/> : <IconLayoutSidebarLeftCollapse/>}
                                </DScreen.CollapsableItem>
                                {!collapsed ? (
                                    <DScreen.BarContent>
                                        <Text size={"md"} hierarchy={"primary"}>
                                            Sagittarius 200
                                        </Text>
                                        <Text size={"xs"}>
                                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                                        </Text>
                                    </DScreen.BarContent>
                                ) : (
                                    <DScreen.BarContent>
                                        <Button color={"info"}><Button.Icon><IconApi/></Button.Icon></Button>
                                    </DScreen.BarContent>
                                )}
                            </>
                        }}
                    </DScreen.HBar.Left>
                    <DScreen.Content>
                        <DScreen>
                            <DScreen.VBar.Top justify={"flex-end"}>
                                <DScreen.BarContent>
                                    <DScreen.Item>
                                        Test Run
                                    </DScreen.Item>
                                </DScreen.BarContent>
                            </DScreen.VBar.Top>
                            <DScreen.VBar.Bottom>
                                <DScreen.BarContent>
                                    <DScreen.Item>
                                        Logs
                                    </DScreen.Item>
                                </DScreen.BarContent>
                            </DScreen.VBar.Bottom>
                            <DScreen.Content>
                                <Text size={"md"}>
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                                </Text>
                            </DScreen.Content>
                        </DScreen>
                    </DScreen.Content>
                </DScreen>

            </DScreen.Content>
        </DScreen>
    </DFullScreen>
}

export default meta