import {Meta} from "@storybook/react-vite";
import {DResizableHandle, DResizablePanel, DResizablePanelGroup} from "./DResizable";
import React from "react";
import {DFullScreen} from "../d-fullscreen/DFullScreen";
import {
    IconAdjustmentsCog, IconAi,
    IconArrowsMaximize,
    IconArrowsMinimize,
    IconCircleDot,
    IconDatabase,
    IconFile,
    IconInbox,
    IconLayoutSidebar,
    IconPlus,
    IconSearch,
    IconTournament
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
import {AuroraBackground} from "../aurora/Aurora";
import {Avatar} from "../avatar/Avatar";

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

    return <DFullScreen>
        <DLayout layoutGap={0} style={{zIndex: 0}}
                 showLayoutSplitter={false}
                 leftContent={<Flex p={0.7} pt={1} align={"center"} style={{flexDirection: "column", gap: "0.7rem"}}>
                     <div style={{
                         position: "absolute",
                         top: 0,
                         left: 0,
                         width: "50%",
                         transform: "scaleX(-1)",
                         height: "40%",
                         zIndex: "-1",
                     }}>
                         <div style={{
                             position: "absolute",
                             top: "0",
                             left: "0",
                             width: "100%",
                             height: "100%",
                             background: "radial-gradient(circle at top right,rgba(25, 24, 37, 0.5) 0%, rgba(25, 24, 37, 1) 25%)",
                             zIndex: "1"
                         }}/>
                         <AuroraBackground/>

                     </div>
                     <img width={30} src={"https://code0.tech/code0_logo.png"}/>
                     <Tooltip>
                         <TooltipTrigger asChild>
                             <Button variant={"none"} paddingSize={"xs"}>
                                 <IconTournament size={16}/>
                             </Button>
                         </TooltipTrigger>
                         <TooltipPortal>
                             <TooltipContent side={"right"} align={"center"}>
                                 <Text>Flow builder</Text>
                             </TooltipContent>
                         </TooltipPortal>
                     </Tooltip>
                     <Button variant={"none"} paddingSize={"xs"}>
                         <IconAdjustmentsCog size={16}/>
                     </Button>
                 </Flex>}>
            <ContextStoreProvider
                services={[[flowTypeStore, flowTypeService], [fileTabsStore, fileTabsService], [dataTypeStore, dataTypeService], [functionStore, functionService], [flowStore, flowService]]}>
                <DLayout layoutGap={"0"} showLayoutSplitter={false} topContent={
                    <>
                        <div style={{
                            padding: "0.7rem"
                        }}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Breadcrumb>
                                    <Text hierarchy={"tertiary"}>CodeZero Orga</Text>
                                    <Text hierarchy={"tertiary"}>projects</Text>
                                    <Text hierarchy={"tertiary"}>Discord Bot</Text>
                                    <Text hierarchy={"tertiary"}>flow</Text>
                                    <Text hierarchy={"tertiary"}>#1</Text>
                                </Breadcrumb>
                                <Flex align={"center"} style={{gap: ".7rem"}}>
                                    <Button disabled variant={"none"} paddingSize={"xs"}>
                                        <IconSearch size={16}/>
                                    </Button>
                                    <Button disabled variant={"none"} paddingSize={"xs"}>
                                        <IconInbox size={16}/>
                                    </Button>
                                    <Avatar identifier={"nsammito"}/>
                                </Flex>
                            </Flex>
                        </div>
                    </>
                } rightContent={
                    <Flex px={0.7} style={{flexDirection: "column", gap: "0.7rem"}}>
                        <Button onClick={() => setShow(prevState => !prevState)} variant={"none"}
                                paddingSize={"xs"} aria-selected={show}>
                            <IconFile size={16}/>
                        </Button>
                    </Flex>
                }>
                    <DResizablePanelGroup orientation={"horizontal"}>
                        <DResizablePanel id={"1"} defaultSize={"20%"} collapsedSize={"0%"}
                                         collapsible minSize={"10%"}>
                            <Folder/>
                        </DResizablePanel>
                        <DResizableHandle/>
                        <DResizablePanel id={"2"} style={{
                            borderTopLeftRadius: "1rem",
                            borderTopRightRadius: "1rem",
                            outline: "100px solid transparent"
                        }}>
                            <DLayout layoutGap={"0"}>
                                <DResizablePanelGroup orientation={"horizontal"}>
                                    <DResizablePanel color={"primary"} id={"2"}>
                                        <DFlow flowId={"gid://sagittarius/Flow/1"} namespaceId={undefined}
                                               projectId={undefined}/>
                                    </DResizablePanel>
                                    {show && (
                                        <>
                                            <DResizableHandle/>
                                            <DResizablePanel color={"primary"} id={"3"} defaultSize={"25%"}>
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
        <Flex style={{flexDirection: "column", gap: "0.7rem"}} px={0.7}>
            <Flex style={{gap: "0.7rem"}} align={"center"} justify={"space-between"}>
                <Text size={"md"} hierarchy={"secondary"}>Explorer</Text>
                <Button variant={"none"} paddingSize={"xxs"}>
                    <IconLayoutSidebar size={16}/>
                </Button>
            </Flex>
            <Flex style={{gap: "0.7rem"}} align={"center"} justify={"space-between"}>
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