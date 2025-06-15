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
import Dialog from "../dialog/Dialog";

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
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"secondary"}>
                            <IconHierarchy3 size={12}/>
                        </Button>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"warning"}>
                            <IconTicket size={12}/>
                        </Button>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"info"}>
                            <IconDatabase size={12}/>
                        </Button>
                    </div>
                    <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"primary"}>
                            <IconSettings size={12}/>
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