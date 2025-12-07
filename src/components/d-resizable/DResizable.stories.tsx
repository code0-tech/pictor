import {Meta} from "@storybook/react-vite";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {
    IconAi, IconCopy,
    IconDatabase, IconFile,
    IconFolder,
    IconLayout,
    IconLayoutDistributeHorizontal,
    IconLayoutDistributeVertical, IconMessageChatbot, IconTrash
} from "@tabler/icons-react";
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
    NamespacesProjectsFlowsCreatePayload,
    NamespacesProjectsFlowsDeleteInput,
    NamespacesProjectsFlowsDeletePayload
} from "@code0-tech/sagittarius-graphql-types";
import {SegmentedControl, SegmentedControlItem} from "../segmented-control/SegmentedControl";
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {Text} from "../text/Text";
import {Tabs, TabsList, TabsTrigger} from "@radix-ui/react-tabs";
import {ButtonGroup} from "../button-group/ButtonGroup";

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

class DFlowReactiveSuggestionServiceExtend extends DFlowReactiveSuggestionService {
}

export const Dashboard = () => {

    const [fileTabsStore, fileTabsService] = useReactiveArrayService<FileTabsView, FileTabsService>(FileTabsService)
    // @ts-ignore
    const [dataTypeStore, dataTypeService] = useReactiveArrayService<DataTypeView, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService, [...DataTypesData.map(data => new DataTypeView(data))]);
    // @ts-ignore
    const [functionStore, functionService] = useReactiveArrayService<FunctionDefinitionView, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, [...FunctionsData.map(data => new FunctionDefinitionView(data))]);
    const [flowStore, flowService] = useReactiveArrayService<FlowView, DFlowReactiveService>(DFlowReactiveServiceExtend, [new FlowView({
        id: "gid://sagittarius/Flow/1",
        type: {
            id: "gid://sagittarius/FlowType/867",
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

    const [show, setShow] = React.useState(false);

    return <DFullScreen>
        <ContextStoreProvider
            services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService], [suggestionStore, suggestionService]]}>
            <DLayout rightContent={
                <Flex p={0.35} style={{flexDirection: "column", gap: "0.7rem"}}>
                    <Button onClick={() => setShow(prevState => !prevState)} variant={"none"} paddingSize={"xs"}>
                        <IconFile size={16}/>
                    </Button>
                    <Button variant={"none"} paddingSize={"xs"}>
                        <IconDatabase size={16}/>
                    </Button>
                    <Button variant={"none"} paddingSize={"xs"}>
                        <IconMessageChatbot size={16}/>
                    </Button>
                </Flex>
            } bottomContent={
                <Flex p={0.35} style={{gap: "0.7rem"}}>
                    <Button variant={"none"} paddingSize={"xs"}>
                        <Text>Logbook</Text>
                    </Button>
                    <Button variant={"none"} paddingSize={"xs"}>
                        <Text>Problems</Text>
                    </Button>
                </Flex>
            }>
                <DResizablePanelGroup direction={"horizontal"}>
                    <DResizablePanel id={"1"} order={1} p={1} defaultSize={15}>
                        <DFlowFolder flowId={"gid://sagittarius/Flow/1"}/>
                    </DResizablePanel>
                    <DResizableHandle/>
                    <DResizablePanel id={"2"} order={2}>
                        <FlowExample/>
                    </DResizablePanel>
                    {show && (
                        <>
                            <DResizableHandle/>
                            <DResizablePanel id={"3"} order={3} defaultSize={25}>
                                <DFlowTabs/>
                            </DResizablePanel>
                        </>
                    )}
                </DResizablePanelGroup>
            </DLayout>
        </ContextStoreProvider>
    </DFullScreen>

}


const FlowExample = () => {

    return <DFlow flowId={"gid://sagittarius/Flow/1"}/>
}