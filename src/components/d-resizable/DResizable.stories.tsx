import {Meta} from "@storybook/react-vite";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {Button} from "../button/Button";
import {
    IconArrowsVertical,
    IconDatabase,
    IconHierarchy3, IconLayout,
    IconLayoutDistributeHorizontal, IconLayoutDistributeVertical,
    IconSettings,
    IconTicket
} from "@tabler/icons-react";
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
import {Background, BackgroundVariant, Panel} from "@xyflow/react";
import {DFlowControl} from "../d-flow/control/DFlowControl";
import {DFlowValidation} from "../d-flow/validation/DFlowValidation";
import {DLayout} from "../d-layout/DLayout";
import {DFlowFolder} from "../d-flow/folder/DFlowFolder";
import {
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload, NamespacesProjectsFlowsDeleteInput, NamespacesProjectsFlowsDeletePayload
} from "@code0-tech/sagittarius-graphql-types";
import {DFlowMiniMap} from "../d-flow";
import {SegmentedControl, SegmentedControlItem} from "../segmented-control/SegmentedControl";

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

    return <DFullScreen>
        <ContextStoreProvider
            services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
            <DResizablePanelGroup direction={"horizontal"}>
                <DResizablePanel p={0.7} defaultSize={15}>
                    <DFlowFolder flowId={"gid://sagittarius/Flow/1"}/>
                </DResizablePanel>
                <DResizableHandle/>
                <DResizablePanel>
                    <FlowExample/>
                </DResizablePanel>
                <DResizableHandle/>
                <DResizablePanel defaultSize={25}>
                    <DFlowTabs/>
                </DResizablePanel>
            </DResizablePanelGroup>
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
        <Panel position={"top-center"}>
            <SegmentedControl type={"single"} defaultValue={"horizontal"}>
                <SegmentedControlItem value={"horizontal"} display={"flex"}>
                    <IconLayoutDistributeHorizontal size={16}/>
                </SegmentedControlItem>
                <SegmentedControlItem disabled value={"vertical"} display={"flex"}>
                    <IconLayoutDistributeVertical size={16}/>
                </SegmentedControlItem>
                <SegmentedControlItem disabled value={"manual"} display={"flex"}>
                    <IconLayout size={16}/>
                </SegmentedControlItem>
            </SegmentedControl>
        </Panel>
        {/*<DFlowMiniMap/>*/}
    </DFlow>
}