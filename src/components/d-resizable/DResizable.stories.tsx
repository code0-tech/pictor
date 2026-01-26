import {Meta} from "@storybook/react-vite";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {
    IconArrowsMaximize,
    IconArrowsMinimize,
    IconCircleDot,
    IconDatabase,
    IconFile,
    IconMessageChatbot
} from "@tabler/icons-react";
import {ContextStoreProvider, useReactiveArrayService} from "../../utils";
import {FileTabsView} from "../file-tabs/FileTabs.view";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {DFlowTabs} from "../d-flow-file";
import DataTypesData from "./data_types.json";
import FunctionsData from "./runtime_functions.json";
import FlowTypeData from "./flow_types.json";
import {DFlow, DFlowReactiveService} from "../d-flow";
import {DLayout} from "../d-layout/DLayout";
import {
    Flow,
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload,
    NamespacesProjectsFlowsDeleteInput,
    NamespacesProjectsFlowsDeletePayload,
    NamespacesProjectsFlowsUpdateInput,
    NamespacesProjectsFlowsUpdatePayload
} from "@code0-tech/sagittarius-graphql-types";
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {Text} from "../text/Text";
import {DFlowFolder, DFlowFolderHandle} from "../d-flow-folder";
import {DataTypeView, DFlowDataTypeReactiveService} from "../d-flow-data-type";
import {DFlowFunctionReactiveService, FunctionDefinitionView} from "../d-flow-function";
import {DFlowTypeReactiveService, FlowTypeView} from "../d-flow-type";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";

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

    flowUpdate(payload: NamespacesProjectsFlowsUpdateInput): Promise<NamespacesProjectsFlowsUpdatePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export const Dashboard = () => {

    const [fileTabsStore, fileTabsService] = useReactiveArrayService<FileTabsView, FileTabsService>(FileTabsService, [])
    // @ts-ignore
    const [dataTypeStore, dataTypeService] = useReactiveArrayService<DataTypeView, DFlowDataTypeReactiveService>(DFlowDataTypeReactiveService, [...DataTypesData.map(data => new DataTypeView(data))]);
    // @ts-ignore
    const [functionStore, functionService] = useReactiveArrayService<FunctionDefinitionView, DFlowFunctionReactiveService>(DFlowFunctionReactiveService, [...FunctionsData.map(data => new FunctionDefinitionView(data))]);
    const [flowStore, flowService] = useReactiveArrayService<Flow, DFlowReactiveService>(DFlowReactiveServiceExtend, [{
        id: "gid://sagittarius/Flow/1",
        type: {
            id: "gid://sagittarius/FlowType/888",
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
        },
        nodes: {
            nodes: []
        },
        updatedAt: "1769364427",
    }, {
        id: "gid://sagittarius/Flow/2",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "de/codezero/examples-2/REST Flow",
        settings: {
            nodes: [{
                flowSettingIdentifier: "HTTP_URL",
            }, {
                flowSettingIdentifier: "HTTP_METHOD",
            }, {
                flowSettingIdentifier: "HTTP_HOST",
            }]
        },
        nodes: {
            nodes: []
        }
    }, {
        id: "gid://sagittarius/Flow/3",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "en/codezero/examples/REST Flow",
        settings: {
            nodes: [{
                flowSettingIdentifier: "HTTP_URL",
            }, {
                flowSettingIdentifier: "HTTP_METHOD",
            }, {
                flowSettingIdentifier: "HTTP_HOST",
            }]
        },
        nodes: {
            nodes: []
        }
    }]);
    // @ts-ignore
    const [flowTypeStore, flowTypeService] = useReactiveArrayService<FlowTypeView, DFlowTypeReactiveService>(DFlowTypeReactiveService, [...FlowTypeData.map(data => new FlowTypeView(data))]);

    const [show, setShow] = React.useState(false);

    return <DFullScreen>
        <ContextStoreProvider
            services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService]]}>
            <DLayout layoutGap={"0"}>
                <DResizablePanelGroup orientation={"horizontal"}>
                    <DResizablePanel id={"1"} defaultSize={"20%"}>
                        <Folder/>
                    </DResizablePanel>
                    <DResizableHandle/>
                    <DResizablePanel id={"2"}>
                        <DLayout layoutGap={"0"} rightContent={
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
                            <DResizablePanelGroup orientation={"horizontal"}>
                                <DResizablePanel id={"2"}>
                                    <DFlow flowId={"gid://sagittarius/Flow/1"} namespaceId={undefined} projectId={undefined}/>
                                </DResizablePanel>
                                {show && (
                                    <>
                                        <DResizableHandle/>
                                        <DResizablePanel id={"3"} defaultSize={"25%"}>
                                            <DFlowTabs flowId={"gid://sagittarius/Flow/1"} namespaceId={undefined}
                                                       projectId={undefined}/>
                                        </DResizablePanel>
                                    </>
                                )}
                            </DResizablePanelGroup>
                        </DLayout>
                    </DResizablePanel>
                </DResizablePanelGroup>
            </DLayout>

        </ContextStoreProvider>
    </DFullScreen>

}

const Folder = () => {

    const ref = React.useRef<DFlowFolderHandle>(null)

    return <DLayout layoutGap={"0"} topContent={
        <Flex style={{gap: "0.35rem"}} align={"center"} justify={"space-between"} p={0.7}>
            <Button paddingSize={"xxs"} color={"success"}>
                <Text>Create new flow</Text>
            </Button>
            <Flex style={{gap: "0.35rem"}}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"none"} paddingSize={"xxs"} onClick={() => ref.current?.openActivePath()}>
                            <IconCircleDot size={12}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent>
                            <Text>Open active flow</Text>
                            <TooltipArrow/>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"none"} paddingSize={"xxs"} onClick={() => ref.current?.closeAll()}>
                            <IconArrowsMinimize size={12}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent>
                            <Text>Close all</Text>
                            <TooltipArrow/>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button paddingSize={"xxs"} variant={"none"} onClick={() => ref.current?.openAll()}>
                            <IconArrowsMaximize size={12}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent>
                            <Text>Open all</Text>
                            <TooltipArrow/>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </Flex>
        </Flex>
    }>
        <div style={{padding: "0.75rem"}}>
            <DFlowFolder onDelete={contextData => console.log(contextData)}
                         onRename={contextData => console.log(contextData)}
                         onCreate={type => console.log(type)}
                         onSelect={(flow) => console.log("select", flow)}
                         ref={ref}
                         activeFlowId={"gid://sagittarius/Flow/1"} namespaceId={undefined} projectId={undefined}/>
        </div>
    </DLayout>
}