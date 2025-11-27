import {Meta} from "@storybook/react-vite";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {Button} from "../button/Button";
import {IconDatabase, IconHierarchy3, IconSettings, IconTicket} from "@tabler/icons-react";
import {Flex} from "../flex/Flex";
import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {FunctionDefinitionView} from "../d-flow/function/DFlowFunction.view";
import {useReactiveArrayService} from "../../utils/reactiveArrayService";
import {FileTabsView} from "../file-tabs/FileTabs.view";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DataTypeView} from "../d-flow/data-type/DFlowDataType.view";
import {DFlowDataTypeReactiveService} from "../d-flow/data-type/DFlowDataType.service";
import {DFlowFunctionReactiveService} from "../d-flow/function/DFlowFunction.service";
import {DFlowReactiveService} from "../d-flow/DFlow.service";
import {DFlowSuggestion} from "../d-flow/suggestion/DFlowSuggestion.view";
import {DFlowReactiveSuggestionService} from "../d-flow/suggestion/DFlowSuggestion.service";
import {FlowView} from "../d-flow/DFlow.view";
import {ContextStoreProvider} from "../../utils/contextStore";
import {DFlowTabs} from "../d-flow/tab/DFlowTabs";
import {DFlowTypeReactiveService} from "../d-flow/type/DFlowType.service";
import {FlowTypeView} from "../d-flow/type/DFlowType.view";
import DataTypesData from "./data_types.json";
import FunctionsData from "./runtime_functions.json";
import FlowTypeData from "./flow_types.json";
import {useFlowNodes} from "../d-flow/DFlow.nodes.hook";
import {useFlowEdges} from "../d-flow/DFlow.edges.hook";
import {DFlow} from "../d-flow/DFlow";
import {Background, BackgroundVariant} from "@xyflow/react";
import {DFlowControl} from "../d-flow/control/DFlowControl";
import {DFlowValidation} from "../d-flow/validation/DFlowValidation";
import {DLayout} from "../d-layout/DLayout";
import {DFlowFolder} from "../d-flow/folder/DFlowFolder";
import {
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload, NamespacesProjectsFlowsDeleteInput, NamespacesProjectsFlowsDeletePayload
} from "@code0-tech/sagittarius-graphql-types";
import {DFlowExport} from "../d-flow/export/DFlowExport";

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

class DFlowReactiveServiceExtend extends DFlowReactiveService {
    flowCreate(payload: NamespacesProjectsFlowsCreateInput): Promise<NamespacesProjectsFlowsCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    flowDelete(payload: NamespacesProjectsFlowsDeleteInput): Promise<NamespacesProjectsFlowsDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

class DFlowReactiveSuggestionServiceExtend extends DFlowReactiveSuggestionService {}

export const Dashboard = () => {

    const [fileTabsStore, fileTabsService] = useReactiveArrayService<FileTabsView, FileTabsService>(FileTabsService)
    // @ts-ignore
    const [dataTypeStore, dataTypeService] = useReactiveArrayService<DataTypeView, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService, [...DataTypesData.map(data => new DataTypeView(data))]);
    // @ts-ignore
    const [functionStore, functionService] = useReactiveArrayService<FunctionDefinitionView, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, [...FunctionsData.map(data => new FunctionDefinitionView(data))]);
    const [flowStore, flowService] = useReactiveArrayService<FlowView, DFlowReactiveService>(DFlowReactiveServiceExtend, [new FlowView({
        id: "gid://sagittarius/Flow/1",
        type: {
            id: "gid://sagittarius/TypesFlowType/842",
        },
        name: "de/codezero/examples/REST Flow",
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
    const [suggestionStore, suggestionService] = useReactiveArrayService<DFlowSuggestion, DFlowReactiveSuggestionService>(DFlowReactiveSuggestionServiceExtend);
    // @ts-ignore
    const [flowTypeStore, flowTypeService] = useReactiveArrayService<FlowTypeView, DFlowTypeReactiveService>(DFlowTypeReactiveService, [...FlowTypeData.map(data => new FlowTypeView(data))]);

    return <DFullScreen p={1}>
        <ContextStoreProvider
            services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
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
                <DLayout leftContent={<DFlowFolder flowId={"gid://sagittarius/Flow/1"}/>}>
                    <DResizablePanelGroup direction={"horizontal"} autoSaveId={"1"}>
                        <DResizablePanel>
                            <FlowExample/>
                        </DResizablePanel>
                        <DResizableHandle/>
                        <DResizablePanel>
                            <DFlowTabs/>
                        </DResizablePanel>
                    </DResizablePanelGroup>
                </DLayout>
            </DLayout>
        </ContextStoreProvider>
    </DFullScreen>

}


const FlowExample = () => {
    const initialNodes = useFlowNodes("gid://sagittarius/Flow/1")
    const initialEdges = useFlowEdges("gid://sagittarius/Flow/1")

    return <DFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
    >
        <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255, .05)" gap={8} size={2}/>
        <DFlowControl/>
        <DFlowValidation flowId={"gid://sagittarius/Flow/1"}/>
        <DFlowExport flowId={"gid://sagittarius/Flow/1"}/>
        {/*<DFlowViewportMiniMap/>*/}
    </DFlow>
}