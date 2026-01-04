import {useService, useStore} from "../../utils";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {FileTabs, FileTabsContent, FileTabsList, FileTabsTrigger} from "../file-tabs/FileTabs";
import React from "react";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuSeparator, MenuTrigger} from "../menu/Menu";
import {Button} from "../button/Button";
import {IconArrowDown, IconArrowUp, IconCornerDownLeft, IconDotsVertical, IconPlus} from "@tabler/icons-react";
import {FileTabsView} from "../file-tabs/FileTabs.view";
import {DLayout} from "../d-layout/DLayout";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Flow, type Namespace, type NamespaceProject} from "@code0-tech/sagittarius-graphql-types";
import {DFlowReactiveService} from "../d-flow";
import {DFlowTypeReactiveService} from "../d-flow-type";
import {Card} from "../card/Card";
import {Flex} from "../flex/Flex";
import {Badge} from "../badge/Badge";
import {Spacing} from "../spacing/Spacing";

export interface DFlowTabsProps {
    flowId: Flow['id']
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
}

export const DFlowTabs: React.FC<DFlowTabsProps> = (props) => {

    const {flowId, namespaceId, projectId} = props

    const fileTabsService = useService(FileTabsService)
    const fileTabsStore = useStore(FileTabsService)
    const flowService = useService(DFlowReactiveService)
    const flowStore = useStore(DFlowReactiveService)
    const flowTypeService = useService(DFlowTypeReactiveService)
    const flowTypeStore = useStore(DFlowTypeReactiveService)
    const id = React.useId()

    const flow = React.useMemo(() => flowService.getById(flowId, {namespaceId, projectId}), [flowStore])
    const flowType = React.useMemo(() => flowTypeService.getById(flow?.type?.id!!), [flowTypeStore, flow])
    const activeTabId = React.useMemo(() => {
        return fileTabsStore.find((t: any) => (t as any).active)?.id ?? fileTabsService.getActiveTab()?.id;
    }, [fileTabsStore, fileTabsService])

    const triggerTab = React.useMemo(() => {
        if (!flowType?.id) return undefined
        return fileTabsStore.find((tab: FileTabsView) => tab.id === flowType.id)
    }, [fileTabsStore, flowType])

    const visibleTabs = React.useMemo(() => {
        return fileTabsStore.filter((tab: FileTabsView) => tab.show)
    }, [fileTabsStore, triggerTab])

    const hiddenTabs = React.useMemo(() => {
        return fileTabsStore.filter((tab: FileTabsView) => !tab.show && tab.id !== triggerTab?.id)
    }, [fileTabsStore, triggerTab])

    React.useEffect(() => {
        setTimeout(() => {
            const parent = document.querySelector("[data-id=" + '"' + id + '"' + "]") as HTMLDivElement
            const tabList = parent.querySelector(".file-tabs__list-content") as HTMLDivElement
            const trigger = tabList.querySelector("[data-value=" + '"' + fileTabsService.getActiveTab()?.id + '"' + "]") as HTMLDivElement

            if (tabList && trigger) {
                const offset = (trigger.offsetLeft + (trigger.offsetWidth / 2)) - (tabList.offsetWidth / 2)
                tabList.scrollLeft = 0 //reset to 0
                tabList.scrollBy({
                    left: offset,
                    behavior: 'smooth'
                });
            }
        }, 0)
    }, [activeTabId, id])

    return (
        <FileTabs
            data-id={id}
            value={activeTabId}
            onValueChange={(value) => {
                fileTabsService.activateTab(value); // mutieren reicht; kein .update() nötig, wenn setState benutzt wird
                fileTabsService.update()
            }}
        >
            <DLayout topContent={<FileTabsList
                controls={
                    <Flex>
                        <Menu>
                            <MenuTrigger asChild>
                                <Button variant="none" paddingSize={"xxs"} color="primary">
                                    <IconPlus size={12}/>
                                </Button>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent align="start" sideOffset={8} color={"secondary"}>
                                    <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
                                        <MenuLabel>Starting Node</MenuLabel>
                                        {triggerTab &&
                                            <MenuItem onSelect={() => fileTabsService.activateTab(triggerTab.id!!)}>
                                                {triggerTab.children}
                                            </MenuItem>}
                                        <MenuSeparator/>
                                        <MenuLabel>Opened Nodes</MenuLabel>
                                        {visibleTabs.map((tab: FileTabsView) => (
                                            <MenuItem key={`menu-${tab.id}`}
                                                      onSelect={() => {
                                                          fileTabsService.activateTab(tab.id!)
                                                      }}>
                                                {tab.children}
                                            </MenuItem>
                                        ))}
                                        <MenuSeparator/>
                                        <MenuLabel>Available Node</MenuLabel>
                                        {hiddenTabs.map((tab: FileTabsView) => (
                                            <MenuItem key={`menu-${tab.id}`}
                                                      onSelect={() => {
                                                          fileTabsService.activateTab(tab.id!)
                                                      }}>
                                                {tab.children}
                                            </MenuItem>
                                        ))}
                                    </Card>
                                    <MenuLabel>
                                        <Flex style={{gap: ".35rem"}}>
                                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                                <Flex>
                                                    <Badge border><IconArrowUp size={12}/></Badge>
                                                    <Badge border><IconArrowDown size={12}/></Badge>
                                                </Flex>
                                                move
                                            </Flex>
                                            <Spacing spacing={"xxs"}/>
                                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                                <Badge border><IconCornerDownLeft size={12}/></Badge>
                                                select
                                            </Flex>
                                        </Flex>
                                    </MenuLabel>
                                </MenuContent>
                            </MenuPortal>
                        </Menu>

                        <Menu>
                            <MenuTrigger asChild>
                                <Button variant="none" paddingSize={"xxs"} color="primary">
                                    <IconDotsVertical size={12}/>
                                </Button>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent align="end" sideOffset={8} color={"secondary"}>
                                    <Card paddingSize={"xxs"} mt={-0.35} mx={-0.35} style={{borderWidth: "2px"}}>
                                        <MenuItem onClick={() => fileTabsService.clearAll()}>Close all tabs</MenuItem>
                                        <MenuItem onClick={() => fileTabsService.clearWithoutActive()}>Close other
                                            tabs</MenuItem>
                                        <MenuSeparator/>
                                        <MenuItem onClick={() => fileTabsService.clearLeft()}>Close all tabs to
                                            left</MenuItem>
                                        <MenuItem onClick={() => fileTabsService.clearRight()}>Close all tabs to
                                            right</MenuItem>
                                    </Card>
                                    <MenuLabel>
                                        <Flex style={{gap: ".35rem"}}>
                                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                                <Flex>
                                                    <Badge border><IconArrowUp size={12}/></Badge>
                                                    <Badge border><IconArrowDown size={12}/></Badge>
                                                </Flex>
                                                move
                                            </Flex>
                                            <Spacing spacing={"xxs"}/>
                                            <Flex align={"center"} style={{gap: ".35rem"}}>
                                                <Badge border><IconCornerDownLeft size={12}/></Badge>
                                                select
                                            </Flex>
                                        </Flex>
                                    </MenuLabel>
                                </MenuContent>
                            </MenuPortal>
                        </Menu>
                    </Flex>
                }
            >
                {visibleTabs.map((tab: FileTabsView, _: number) => {
                    return tab.show && <FileTabsTrigger
                        key={`trigger-${tab.id}`}
                        closable={tab.closeable}
                        value={tab.id!}
                        onClose={() => {
                            fileTabsService.removeTabById(tab.id!!)
                        }}
                    >
                        {tab.children}
                    </FileTabsTrigger>
                })}
            </FileTabsList>}>
                {fileTabsStore.map((tab: FileTabsView) => (
                    <FileTabsContent key={`content-${tab.id}`} value={tab.id!}>
                        {tab.content}
                    </FileTabsContent>
                ))}
            </DLayout>
        </FileTabs>
    );

}