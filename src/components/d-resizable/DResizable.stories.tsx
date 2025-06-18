import {Meta} from "@storybook/react";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import {ZoomPanPinchExample} from "../d-zoom-pan-pinch/DZoomPanPinch.stories";
import DFolder, {useFolderControls} from "../d-folder/DFolder";
import Button from "../button/Button";
import {IconBrandAdobe, IconDatabase, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import Flex from "../flex/Flex";
import Text from "../text/Text";
import {MenuExample} from "../menu /Menu.stories";

const meta: Meta = {
    title: "Dashboard Resizable",
    component: DResizablePanelGroup,
    parameters: {
        visualTest: {
            selector: 'body'
        },
        layout: "fullscreen"
    },
}

export default meta

export const test = () => {

    const [controls, openAll, closeAll] = useFolderControls()

    return <DFullScreen>
        <DResizablePanelGroup direction={"horizontal"}>
            <DResizablePanel w={"fit-content"}>
                <Flex justify={"space-between"} style={{flexDirection: "column"}} h={"100%"}>
                    <Flex style={{flexDirection: "column", gap: ".5rem"}} h={"100%"}>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"secondary"}>
                            <IconHierarchy3 size={12}/>
                        </Button>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"warning"}>
                            <IconTicket size={12}/>
                        </Button>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"info"}>
                            <IconDatabase size={12}/>
                        </Button>
                    </Flex>
                    <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                        <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"primary"}>
                            <IconSettings size={12}/>
                        </Button>
                    </div>
                </Flex>
            </DResizablePanel>
            <DResizableHandle/>
            <DResizablePanel>
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
            </DResizablePanel>
            <DResizableHandle/>
            <DResizablePanel>
                <ZoomPanPinchExample/>
            </DResizablePanel>
        </DResizablePanelGroup>
    </DFullScreen>
}

export const Dashboard = () => {

    return <DFullScreen p={1}>
        <Flex style={{gap: "1rem", width: "100%", height: "100%", position: "relative"}}>
            <Flex justify={"space-between"} style={{flexDirection: "column"}} h={"100%"}>
                <Flex style={{flexDirection: "column", gap: ".5rem"}} h={"100%"}>
                    <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"secondary"}>
                        <IconHierarchy3 size={12}/>
                    </Button>
                    <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"warning"}>
                        <IconTicket size={12}/>
                    </Button>
                    <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"info"}>
                        <IconDatabase size={12}/>
                    </Button>
                </Flex>
                <div style={{display: "flex", gap: ".5rem", overflow: "hidden"}}>
                    <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"primary"}>
                        <IconSettings size={12}/>
                    </Button>
                </div>
            </Flex>
            <div>
                {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => {
                    return <DFolder name={"Google Cloud Flows"} defaultOpen>
                        <DFolder name={"Google Cloud Flows"}>
                            <DFolder.Item icon={<IconBrandAdobe size={12}/>}
                                          name={"Google Cloud Flows"}/>
                            <DFolder.Item active={index === 1} name={"Google Cloud Flows"}/>
                        </DFolder>
                    </DFolder>
                })}
            </div>
            <Flex style={{position: "relative", flex: 1, flexDirection: "column", width: "100%", height: "100%", boxSizing: "border-box"}}>
                <div>
                    <MenuExample/>
                    <br/>
                </div>
                <div style={{position: "relative", overflow: "auto", flex: "1 1 auto", boxSizing: "border-box"}}>
                    <DResizablePanelGroup direction={"horizontal"} autoSaveId={"1"}>
                        <DResizablePanel>
                            <ZoomPanPinchExample/>
                        </DResizablePanel>
                        <DResizableHandle/>
                        <DResizablePanel collapsible collapsedSize={10}>
                            <DResizablePanelGroup direction={"vertical"}>
                                <DResizablePanel>
                                    <ZoomPanPinchExample/>
                                </DResizablePanel>
                                <DResizableHandle/>
                                <DResizablePanel>
                                    <ZoomPanPinchExample/>
                                </DResizablePanel>
                            </DResizablePanelGroup>
                        </DResizablePanel>
                    </DResizablePanelGroup>
                </div>
                {/*<Text style={{flexShrink: 0}}>Test</Text>
                <div style={{position: "relative", background: "black", flexShrink: 0}}>
                    <DResizablePanelGroup direction={"horizontal"}>
                        <DResizablePanel>
                            <ZoomPanPinchExample/>
                        </DResizablePanel>
                        <DResizableHandle/>
                        <DResizablePanel>
                            <ZoomPanPinchExample/>
                        </DResizablePanel>
                    </DResizablePanelGroup>
                </div>
                */}

            </Flex>

        </Flex>
    </DFullScreen>

}