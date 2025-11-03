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
import {FunctionDefinitionView} from "../d-flow/function/DFlowFunction.view";
import {useReactiveArrayService} from "../../utils/reactiveArrayService";
import {FileTabsView} from "../file-tabs/FileTabs.view";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DataTypeView} from "../d-flow/data-type/DFlowDataType.view";
import {DFlowDataTypeReactiveService} from "../d-flow/data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "../d-flow/function/DFlowFunction.service";
import {DFlowReactiveService} from "../d-flow/DFlow.service";
import {DFlowSuggestion} from "../d-flow/suggestions/DFlowSuggestion.view";
import {DFlowReactiveSuggestionService} from "../d-flow/suggestions/DFlowSuggestion.service";
import {FlowView} from "../d-flow/DFlow.view";
import {ContextStoreProvider} from "../../utils/contextStore";
import {DFlowViewportTabs} from "../d-flow/viewport/file-tabs/DFlowViewportTabs";
import {DFlowTypeReactiveService} from "../d-flow/type/DFlowType.service";
import {FlowTypeView} from "../d-flow/type/DFlowType.view";
import DataTypesData from "./data_types.json";
import FunctionsData from "./runtime_functions.json";
import FlowTypeData from "./flow_types.json";
import {useFlowViewportNodes} from "../d-flow/viewport/DFlowViewport.nodes.hook";
import {useFlowViewportEdges} from "../d-flow/viewport/DFlowViewport.edges.hook";
import {DFlow} from "../d-flow/DFlow";
import {Background, BackgroundVariant} from "@xyflow/react";
import {DFlowViewportControls} from "../d-flow/viewport/DFlowViewportControls";
import {DFlowViewportValidations} from "../d-flow/viewport/DFlowViewportValidations";
import {DLayout} from "../d-layout/DLayout";

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
    // @ts-ignore
    const [dataTypeStore, dataTypeService] = useReactiveArrayService<DataTypeView, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService, [...DataTypesData.map(data => new DataTypeView(data))]);
    // @ts-ignore
    const [functionStore, functionService] = useReactiveArrayService<FunctionDefinitionView, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, [...FunctionsData.map(data => new FunctionDefinitionView(data))]);
    const [flowStore, flowService] = useReactiveArrayService<FlowView, DFlowReactiveService>(DFlowReactiveService, [new FlowView({
        id: "gid://sagittarius/Flow/1",
        type: {
            id: "gid://sagittarius/TypesFlowType/842",
        },
        settings: {
            nodes: [{
                flowSettingIdentifier: "HTTP_URL",
            }, {
                flowSettingIdentifier: "HTTP_METHOD",
            }, {
                flowSettingIdentifier: "HTTP_HOST",
            }]
        }
    })]);
    const [suggestionStore, suggestionService] = useReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionService);
    // @ts-ignore
    const [flowTypeStore, flowTypeService] = useReactiveArrayService<FlowTypeView, DFlowTypeReactiveService>(DFlowTypeReactiveService, [...FlowTypeData.map(data => new FlowTypeView(data))]);

    return <DFullScreen p={1}>
        <DLayout leftContent={<Flex justify={"space-between"} style={{flexDirection: "column"}} h={"100%"}>
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
        </Flex>}>
            <DLayout leftContent={<ScrollArea h={"100%"}>
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
            </ScrollArea>}>
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
            </DLayout>
        </DLayout>
    </DFullScreen>

}


const FlowExample = () => {
    const initialNodes = useFlowViewportNodes("gid://sagittarius/Flow/1")
    const initialEdges = useFlowViewportEdges("gid://sagittarius/Flow/1")

    return <DFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
    >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .05)" gap={8} size={2}/>
        <DFlowViewportControls/>
        <DFlowViewportValidations flowId={"gid://sagittarius/Flow/1"}/>
        {/*<DFlowViewportMiniMap/>*/}
    </DFlow>
}