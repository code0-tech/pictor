import {Meta} from "@storybook/react-vite";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {
    IconArrowsMaximize,
    IconArrowsMinimize,
    IconCircleDot,
    IconDatabase,
    IconFile, IconInbox,
    IconMessageChatbot,
    IconPlus, IconSearch
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
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Breadcrumb} from "../breadcrumb/Breadcrumb";
import {TextInput} from "../form";
import {Badge} from "../badge/Badge";
import {PanelImperativeHandle, usePanelRef} from "react-resizable-panels";

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
        name: "de/codezero/examples/Discord Channel Create Event Flow Example",
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
    }, {
        id: "gid://sagittarius/Flow/4",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "//sp/////codezero/examples/REST Flow",
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
        id: "gid://sagittarius/Flow/5",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "us/codezero/examples/REST Flow",
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
        id: "gid://sagittarius/Flow/6",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "cz/codezero/examples/REST Flow",
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
        id: "gid://sagittarius/Flow/7",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "ens/codezero/examples/REST Flow",
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
        id: "gid://sagittarius/Flow/8",
        type: {
            id: "gid://sagittarius/FlowType/888",
        },
        name: "ensp/codezero/examples/REST Flow",
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
    const [isFolderCollapsed, setIsFolderCollapsed] = React.useState(false);

    const styles = React.useMemo(() => {
        return !isFolderCollapsed ? {borderTopLeftRadius: "1rem"} : {borderTopLeftRadius: "0rem"}
    }, [isFolderCollapsed])

    return <DFullScreen>
        <DLayout layoutGap={0} style={{zIndex: 0}} topContent={
            <>
                <div style={{
                    padding: "0 0.7rem",
                    background: "rgb(21.8, 19.1, 37.1)",
                }}>
                    <Flex style={{gap: "0.7rem", flexDirection: "column"}} py={0.7} w={"100%"}>
                        <Flex align={"center"} justify={"space-between"}>
                            <Flex align={"center"} style={{gap: "1.3rem"}}>
                                <img width={30} src={"https://code0.tech/code0_logo.png"}/>
                                <Breadcrumb>
                                    <Text>CodeZero Orga</Text>
                                    <Text>projects</Text>
                                    <Text>Discord Bot</Text>
                                    <Text>flow</Text>
                                    <Text>#1</Text>
                                </Breadcrumb>
                            </Flex>
                            <Flex align={"center"} style={{gap: "0.7rem"}}>
                                <TextInput disabled left={<IconSearch size={16}/>} right={<Badge>⌘K</Badge>} rightType={"icon"}
                                           placeholder={"Search..."}/>
                                <Button>
                                    <IconInbox size={16}/>
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                </div>
            </>
        }>
            <ContextStoreProvider
                services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService]]}>
                <DLayout layoutGap={"0"}>
                    <DResizablePanelGroup orientation={"horizontal"}>
                        <DResizablePanel onResize={(panelSize) => setIsFolderCollapsed(panelSize.asPercentage <= 0)} id={"1"} defaultSize={"20%"} collapsedSize={"0%"} collapsible minSize={"10%"}>
                            <Folder/>
                        </DResizablePanel>
                        <DResizableHandle bg={"transparent"}/>
                        <DResizablePanel id={"2"}>
                            <DLayout layoutGap={"0"} style={{
                                ...styles,
                                outline: "100px solid rgb(21.8, 19.1, 37.1)"
                            }} rightContent={
                                <Flex p={0.35} style={{flexDirection: "column", gap: "0.7rem"}}>
                                    <Button onClick={() => setShow(prevState => !prevState)} variant={"none"}
                                            paddingSize={"xs"}>
                                        <IconFile size={16}/>
                                    </Button>
                                    <Button variant={"none"} paddingSize={"xs"}>
                                        <IconDatabase size={16}/>
                                    </Button>
                                    <Button variant={"none"} paddingSize={"xs"}>
                                        <IconMessageChatbot size={16}/>
                                    </Button>
                                </Flex>
                            }>
                                <DResizablePanelGroup orientation={"horizontal"}>
                                    <DResizablePanel id={"2"}>
                                        <DFlow flowId={"gid://sagittarius/Flow/1"} namespaceId={undefined}
                                               projectId={undefined}/>
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
        </DLayout>
    </DFullScreen>

}

const Folder = () => {

    const ref = React.useRef<DFlowFolderHandle>(null)

    return <DLayout layoutGap={"0"} topContent={
        <Flex style={{gap: "0.7rem"}} align={"center"} justify={"space-between"} px={0.7}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button color={"tertiary"} paddingSize={"xxs"}>
                        <IconPlus size={13}/>
                    </Button>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent side={"bottom"}>
                        <Text>Add new flow</Text>
                        <TooltipArrow/>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
            <ButtonGroup color={"secondary"} style={{boxShadow: "none"}} p={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"none"} paddingSize={"xxs"} onClick={() => ref.current?.openActivePath()}>
                            <IconCircleDot size={13}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent side={"bottom"}>
                            <Text>Open active flow</Text>
                            <TooltipArrow/>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"none"} paddingSize={"xxs"} onClick={() => ref.current?.closeAll()}>
                            <IconArrowsMinimize size={13}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent side={"bottom"}>
                            <Text>Close all</Text>
                            <TooltipArrow/>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button paddingSize={"xxs"} variant={"none"} onClick={() => ref.current?.openAll()}>
                            <IconArrowsMaximize size={13}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipPortal>
                        <TooltipContent side={"bottom"}>
                            <Text>Open all</Text>
                            <TooltipArrow/>
                        </TooltipContent>
                    </TooltipPortal>
                </Tooltip>
            </ButtonGroup>
        </Flex>
    }>
        <DFlowFolder onDelete={contextData => console.log(contextData)}
                     onRename={contextData => console.log(contextData)}
                     onCreate={type => console.log(type)}
                     onSelect={(flow) => console.log("select", flow)}
                     ref={ref}
                     activeFlowId={"gid://sagittarius/Flow/1"} namespaceId={undefined} projectId={undefined}/>

    </DLayout>
}