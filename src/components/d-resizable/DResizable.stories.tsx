import {Meta} from "@storybook/react";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DFolder from "../d-folder/DFolder";
import Button from "../button/Button";
import {
    IconDatabase,
    IconFileFilled,
    IconHierarchy3,
    IconSettings,
    IconTicket
} from "@tabler/icons-react";
import Flex from "../flex/Flex";
import {ExampleFileTabs} from "../file-tabs/FileTabs.stories";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {ExampleFlowLine} from "../flow-line/FlowLines.stories";

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

export const Dashboard = () => {

    return <DFullScreen p={1}>
        <Flex style={{gap: "1rem", width: "100%", height: "100%", position: "relative"}}>
            <Flex justify={"space-between"} style={{flexDirection: "column"}} h={"100%"}>
                <Flex style={{flexDirection: "column", gap: ".5rem"}} h={"100%"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"secondary"}>
                                <IconHierarchy3 size={12}/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent sideOffset={5.6} side={"left"}>
                                All Flows
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"warning"}>
                                <IconTicket size={12}/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent sideOffset={5.6} side={"left"}>
                                Issue Management
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"info"}>
                                <IconDatabase size={12}/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent sideOffset={5.6} side={"left"}>
                                Database
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                </Flex>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"} color={"primary"}>
                                <IconSettings size={12}/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                            <TooltipContent sideOffset={5.6} side={"left"}>
                                Settings
                            </TooltipContent>
                        </TooltipPortal>
                    </Tooltip>
                </div>
            </Flex>
            <ScrollArea>
                <ScrollAreaViewport>
                    {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => {
                        return <DFolder name={"Google Cloud Flows"} defaultOpen>
                            <DFolder name={"Google Cloud Flows"}>
                                <DFolder.Item icon={<IconFileFilled size={12}/>}
                                              name={"Google Cloud Flows"}/>
                                <DFolder.Item active={index === 1} name={"Google Cloud Flows"}/>
                            </DFolder>
                        </DFolder>
                    })}
                </ScrollAreaViewport>
                <ScrollAreaScrollbar orientation={"vertical"}>
                    <ScrollAreaThumb/>
                </ScrollAreaScrollbar>
            </ScrollArea>
            <Flex style={{
                position: "relative",
                flex: 1,
                flexDirection: "column",
                width: "100%",
                height: "100%",
                boxSizing: "border-box"
            }}>
                <div style={{position: "relative", overflow: "auto", flex: "1 1 auto", boxSizing: "border-box"}}>
                    <DResizablePanelGroup direction={"horizontal"} autoSaveId={"1"}>
                        <DResizablePanel collapsible collapsedSize={0} minSize={10}>
                            <ExampleFlowLine/>
                        </DResizablePanel>
                        <DResizableHandle/>
                        <DResizablePanel>
                            <ExampleFileTabs/>
                        </DResizablePanel>
                    </DResizablePanelGroup>
                </div>
            </Flex>

        </Flex>
    </DFullScreen>

}