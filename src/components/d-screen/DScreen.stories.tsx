import {Meta} from "@storybook/react";
import React from "react";
import DScreen from "./DScreen";
import {
    IconBrandAdobe,
    IconDatabase,
    IconHierarchy3,
    IconSettings,
    IconTicket
} from "@tabler/icons-react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DFolder, {useFolderControls} from "../d-folder/DFolder";
import DScreenBar from "./DScreenBar";
import DScreenButton from "./DScreenButton";
import Text from "../text/Text";

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
            <DScreenBar type={"top"} align={"center"}>
                <Text>Home</Text>
                <Text mx={0.5}>/</Text>
                <Text>Organisations</Text>
                <Text mx={0.5}>/</Text>
                <Text>Code0</Text>
                <Text mx={0.5}>/</Text>
                <Text>Projects</Text>
                <Text mx={0.5}>/</Text>
                <Text>Sagittarius</Text>
            </DScreenBar>
            <DScreenBar type={"bottom"}>
                <Text>Test</Text>
            </DScreenBar>
            <DScreenBar type={"left"} justify={"space-between"} resizeable>
                <div style={{display: "flex", flexDirection: "column", gap: ".5rem", overflow: "hidden"}}>
                    <DScreenButton color={"secondary"}>
                        <IconHierarchy3 size={12}/>
                        Flows
                    </DScreenButton>
                    <DScreenButton color={"warning"}>
                        <IconTicket size={12}/>
                        Issues
                    </DScreenButton>
                    <DScreenButton color={"info"}>
                        <IconDatabase size={12}/>
                        Database
                    </DScreenButton>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: ".5rem", overflow: "hidden"}}>
                    <DScreenButton color={"primary"}>
                        <IconSettings size={12}/>
                        Settings
                    </DScreenButton>
                </div>
            </DScreenBar>
            <DScreenBar type={"right"} resizeable>
                <DScreenButton>
                    Docs
                </DScreenButton>
            </DScreenBar>

            <DScreen>
                <DScreenBar type={"left"} p={"0"} resizeable>
                    <DScreen>
                        <DScreenBar miw={300} type={"top"}>
                            <DScreenButton onClick={openAll}>
                                Open All
                            </DScreenButton>
                            <DScreenButton onClick={closeAll}>
                                Close All
                            </DScreenButton>
                        </DScreenBar>
                        <div style={{padding: ".5rem"}}>
                            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => {
                                return <DFolder controls={controls} name={"Google Cloud Flows"} defaultOpen>
                                    <DFolder controls={controls} name={"Google Cloud Flows"}>
                                        <DFolder.Item icon={<IconBrandAdobe size={12}/>}
                                                      name={"Google Cloud Flows"}/>
                                        <DFolder.Item active={index === 1} name={"Google Cloud Flows"}/>
                                    </DFolder>
                                </DFolder>
                            })}
                        </div>
                    </DScreen>
                </DScreenBar>
                <DScreen>
                    <DScreenBar type={"top"} resizeable justify={"flex-end"}>
                        <DScreenButton>
                            Test Run
                        </DScreenButton>
                    </DScreenBar>
                    <DScreenBar type={"bottom"} resizeable>
                        <DScreenButton>
                            Logs
                        </DScreenButton>
                    </DScreenBar>
                    <Text>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                        tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                    </Text>
                </DScreen>
            </DScreen>
        </DScreen>
    </DFullScreen>
}

/*export const DashboardResizeLabelTest = () => {
    return <DFullScreen>
        <DScreen>
            <DScreen.VBar.Top>
                <DScreen.BarContent align={"center"} mediaMaxWidth={800}>
                    <Badge>Home</Badge>
                    <text size={"sm"} mx={0.5}>/</text>
                    <Badge>...</Badge>
                    <text size={"sm"} mx={0.5}>/</text>
                    <Badge>Sagittarius</Badge>
                </DScreen.BarContent>
                <DScreen.BarContent align={"center"} mediaMinWidth={800}>
                    <Badge>Home</Badge>
                    <text size={"sm"} mx={0.5}>/</text>
                    <Badge>Organisations</Badge>
                    <text size={"sm"} mx={0.5}>/</text>
                    <Badge>Code0</Badge>
                    <text size={"sm"} mx={0.5}>/</text>
                    <Badge>Projects</Badge>
                    <text size={"sm"} mx={0.5}>/</text>
                    <Badge>Sagittarius</Badge>
                </DScreen.BarContent>
            </DScreen.VBar.Top>
            <DScreen.VBar.Bottom>
                <DScreen.BarContent>
                    <Badge>Test</Badge>
                </DScreen.BarContent>
            </DScreen.VBar.Bottom>
            <DScreen.Content>
                <text >
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </text>
            </DScreen.Content>
        </DScreen>
    </DFullScreen>
}*/

export default meta