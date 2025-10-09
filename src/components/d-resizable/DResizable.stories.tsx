import {Meta} from "@storybook/react";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import DFullScreen from "../d-fullscreen/DFullScreen";
import DFolder from "../d-folder/DFolder";
import Button from "../button/Button";
import {IconDatabase, IconFileFilled, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import Flex from "../flex/Flex";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {useFlowViewportNodes} from "../d-flow/viewport/DFlowViewport.nodes.hook";
import {useFlowViewportEdges} from "../d-flow/viewport/DFlowViewport.edges.hook";
import {DFlowViewportDefaultCard} from "../d-flow/viewport/cards/DFlowViewportDefaultCard";
import {DFlowViewportGroupCard} from "../d-flow/viewport/cards/DFlowViewportGroupCard";
import {DFlowViewportSuggestionCard} from "../d-flow/viewport/cards/DFlowViewportSuggestionCard";
import {DFlowViewportEdge} from "../d-flow/viewport/DFlowViewportEdge";
import {DFlow} from "../d-flow/DFlow";
import {Background, BackgroundVariant} from "@xyflow/react";
import {DFlowViewportControls} from "../d-flow/viewport/DFlowViewportControls";
import {FunctionDefinitionView} from "../d-flow/function/DFlowFunction.view";
import {functionData} from "../d-flow/function/DFlowFunction.data";
import {useReactiveArrayService} from "../../utils/reactiveArrayService";
import {FileTabsView} from "../file-tabs/FileTabs.view";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DataTypeView} from "../d-flow/data-type/DFlowDataType.view";
import {DFlowDataTypeReactiveService} from "../d-flow/data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "../d-flow/function/DFlowFunction.service";
import {DFlowReactiveService} from "../d-flow/DFlow.service";
import {flow1} from "../d-flow/DFlow.data";
import {DFlowSuggestion} from "../d-flow/suggestions/DFlowSuggestion.view";
import {DFlowReactiveSuggestionService} from "../d-flow/suggestions/DFlowSuggestion.service";
import {dataTypes} from "../d-flow/data-type/DFlowDataType.data";
import {FlowView} from "../d-flow/DFlow.view";
import {ContextStoreProvider} from "../../utils/contextStore";
import {DFlowViewportTabs} from "../d-flow/viewport/file-tabs/DFlowViewportTabs";
import {DFlowViewportTriggerCard} from "../d-flow/viewport/cards/DFlowViewportTriggerCard";
import {FlowType} from "../d-flow/type/DFlowType.view";
import {DFlowTypeReactiveService} from "../d-flow/type/DFlowType.service";
import {REST_FLOW_TYPE} from "../d-flow/type/DFlowType.data";

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

    const [fileTabsStore, fileTabsService] = useReactiveArrayService<FileTabsView, FileTabsService>(FileTabsService)
    const [dataTypeStore, dataTypeService] = useReactiveArrayService<DataTypeView, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService, (service) => {
        return dataTypes.map(dataType => (new DataTypeView(dataType, service)))
    })
    const [functionStore, functionService] = useReactiveArrayService<FunctionDefinitionView, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, functionData.map((fd) => new FunctionDefinitionView(fd)));
    const [flowStore, flowService] = useReactiveArrayService<FlowView, DFlowReactiveService>(DFlowReactiveService, [new FlowView(flow1)]);
    const [suggestionStore, suggestionService] = useReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionService);
    const [flowTypeStore, flowTypeService] = useReactiveArrayService<FlowType, DFlowTypeReactiveService>(DFlowTypeReactiveService, [REST_FLOW_TYPE]);

    return <DFullScreen p={1}>
        <Flex style={{gap: "1rem", width: "100%", height: "100%", position: "relative"}}>
            <Flex justify={"space-between"} style={{flexDirection: "column"}} h={"100%"}>
                <Flex style={{flexDirection: "column", gap: ".5rem"}} h={"100%"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"}
                                    color={"secondary"}>
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
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"}
                                    color={"warning"}>
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
                            <Button style={{aspectRatio: "50/50", width: "40px"}} variant={"outlined"}
                                    color={"primary"}>
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
                        return <DFolder key={index} name={"Google Cloud Flows"} defaultOpen>
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
                        <ContextStoreProvider
                            services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
                            <DResizablePanel>
                                <FlowExample/>
                            </DResizablePanel>
                            <DResizableHandle/>
                            <DResizablePanel>
                                <DFlowViewportTabs/>
                            </DResizablePanel>
                        </ContextStoreProvider>
                    </DResizablePanelGroup>
                </div>
            </Flex>

        </Flex>
    </DFullScreen>

}

const FlowExample = () => {
    const initialNodes = useFlowViewportNodes("some_database_id")
    const initialEdges = useFlowViewportEdges("some_database_id")

    return <DFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
    >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .05)" gap={8} size={2}/>
        <DFlowViewportControls/>
        {/*<DFlowViewportMiniMap/>*/}
    </DFlow>
}