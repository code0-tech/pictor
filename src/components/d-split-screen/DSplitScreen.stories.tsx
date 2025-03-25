import React from "react";
import {Meta} from "@storybook/react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DSplitScreen from "./DSplitScreen";
import DSplitPane from "./pane/DSplitPane";
import DFolder, {useFolderControls} from "../d-folder/DFolder";
import {IconBrandAdobe, IconDatabase, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import {ZoomPanPinchExample} from "../d-zoom-pan-pinch/DZoomPanPinch.stories";
import Button from "../button/Button";
import DBar from "../d-bar/DBar";
import Flex from "../flex/Flex";
import Text from "../text/Text";

const meta: Meta = {
    title: "DSplitPane",
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export const Dashboard = () => {

    const [controls, openAll, closeAll] = useFolderControls()

    return <DFullScreen>
        <Flex style={{ width: "100%", height: "100%"}}>
            <DBar orientation={"right"} style={{writingMode: "vertical-rl"}}>
                <Flex justify={"space-between"} h={"100%"}>
                    <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                        <Button color={"secondary"}>
                            <IconHierarchy3 size={12}/>
                            Flows
                        </Button>
                        <Button color={"warning"}>
                            <IconTicket size={12}/>
                            Issues
                        </Button>
                        <Button color={"info"}>
                            <IconDatabase size={12}/>
                            Database
                        </Button>
                    </div>
                    <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                        <Button color={"primary"}>
                            <IconSettings size={12}/>
                            Settings
                        </Button>
                    </div>
                </Flex>
            </DBar>
            <Flex style={{flexDirection: "column", width: "100%", height: "100%"}}>
                <DBar>
                    <Text>Home</Text>
                    <Text mx={0.5}>/</Text>
                    <Text>Organisations</Text>
                    <Text mx={0.5}>/</Text>
                    <Text>Code0</Text>
                    <Text mx={0.5}>/</Text>
                    <Text>Projects</Text>
                    <Text mx={0.5}>/</Text>
                    <Text>Sagittarius</Text>
                </DBar>
                <DSplitScreen>
                    <DSplitPane maw={"fit-content"}>
                        <DBar>
                            <Button onClick={openAll}>
                                Open All
                            </Button>
                            <Button onClick={closeAll}>
                                Close All
                            </Button>
                        </DBar>
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
                    </DSplitPane>
                    <DSplitPane>
                        <ZoomPanPinchExample/>
                    </DSplitPane>
                </DSplitScreen>
                <DBar orientation={"top"}>
                    <Text>Test</Text>
                </DBar>
            </Flex>
            <DBar orientation={"left"} display={"flex"} style={{flexDirection: "column"}}>
                <Button>Docs</Button>
            </DBar>
        </Flex>


    </DFullScreen>

}


export default meta