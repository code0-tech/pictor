import {Meta} from "@storybook/react";
import React from "react";
import DScreen from "./DScreen";
import Badge from "../badge/Badge";
import {
    IconApi, IconArrowDown, IconBrandAdobe,
    IconDatabase,
    IconHierarchy3,
    IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse,
    IconSettings,
    IconTicket
} from "@tabler/icons-react";
import Text from "../Text/Text";
import DFullScreen from "../d-fullscreen/DFullScreen";
import Button from "../button/Button";
import DFolder, {useFolderControls} from "../d-folder/DFolder";

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

    const [controls, openAll, closeAll] = useFolderControls()

    return <DFullScreen>
        <DScreen>
            <DScreen.VBar.Top>
                <DScreen.BarContent align={"center"} mediaMaxWidth={800}>
                    <Badge>Home</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>...</Badge>
                    <Text size={"sm"} mx={0.5}>/</Text>
                    <Badge>Sagittarius</Badge>
                </DScreen.BarContent>
                <DScreen.BarContent align={"center"} mediaMinWidth={800}>
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
            <DScreen.HBar.Left resizeable>
                <DScreen.BarContent justify={"space-between"}>
                    <div style={{display: "flex", flexDirection: "column", gap: ".5rem", overflow: "hidden"}}>
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
                    <div style={{display: "flex", flexDirection: "column", gap: ".5rem", overflow: "hidden"}}>
                        <DScreen.Item>
                            <IconSettings size={12}/>
                            Settings
                        </DScreen.Item>
                    </div>
                </DScreen.BarContent>
            </DScreen.HBar.Left>
            <DScreen.HBar.Right resizeable>
                <DScreen.BarContent>
                    <DScreen.Item>
                        Docs
                    </DScreen.Item>
                </DScreen.BarContent>
            </DScreen.HBar.Right>
            <DScreen.Content>
                <DScreen>
                    <DScreen.HBar.Left resizeable>
                        <DScreen.BarContent p={"0"}>
                            <DScreen>
                                <DScreen.VBar.Top>
                                    <DScreen.BarContent>
                                        <DScreen.Item onClick={openAll}>
                                            Open All
                                        </DScreen.Item>
                                        <DScreen.Item onClick={closeAll}>
                                            Close All
                                        </DScreen.Item>
                                    </DScreen.BarContent>
                                </DScreen.VBar.Top>
                                <DScreen.Content p={0.5}>
                                    {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(() => {
                                        return <DFolder controls={controls} name={"Google Cloud Flows"} defaultOpen>
                                            <DFolder controls={controls} name={"Google Cloud Flows"}>
                                                <DFolder.Item icon={<IconBrandAdobe size={12}/>}
                                                              name={"Google Cloud Flows"}/>
                                                <DFolder.Item active name={"Google Cloud Flows"}/>
                                            </DFolder>
                                        </DFolder>
                                    })}
                                </DScreen.Content>
                            </DScreen>
                        </DScreen.BarContent>
                    </DScreen.HBar.Left>
                    <DScreen.Content>
                        <DScreen>
                            <DScreen.VBar.Top resizeable justify={"flex-end"}>
                                <DScreen.BarContent>
                                    <DScreen.Item>
                                        Test Run
                                    </DScreen.Item>
                                </DScreen.BarContent>
                            </DScreen.VBar.Top>
                            <DScreen.VBar.Bottom resizeable>
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