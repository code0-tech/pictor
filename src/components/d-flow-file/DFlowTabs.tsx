import {useService, useStore} from "../../utils";
import {FileTabsService} from "../file-tabs/FileTabs.service";
import {FileTabs, FileTabsContent, FileTabsList, FileTabsTrigger} from "../file-tabs/FileTabs";
import React from "react";
import {Menu, MenuContent, MenuItem, MenuLabel, MenuPortal, MenuSeparator, MenuTrigger} from "../menu/Menu";
import {Button} from "../button/Button";
import {IconDotsVertical, IconPlus} from "@tabler/icons-react";
import {FileTabsView} from "../file-tabs/FileTabs.view";
import {DLayout} from "../d-layout/DLayout";
import {ButtonGroup} from "../button-group/ButtonGroup";
import {Flow, type Namespace, type NamespaceProject} from "@code0-tech/sagittarius-graphql-types";
import {DFlowReactiveService} from "../d-flow";
import {DFlowTypeReactiveService} from "../d-flow-type";

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
        return fileTabsService.values().find((tab: FileTabsView) => tab.id === flowType.id)
    }, [fileTabsStore, flowType])

    const visibleTabs = React.useMemo(() => {
        return fileTabsService.values().filter((tab: FileTabsView) => tab.show)
    }, [fileTabsStore, triggerTab])

    const hiddenTabs = React.useMemo(() => {
        return fileTabsService.values().filter((tab: FileTabsView) => !tab.show && tab.id !== triggerTab?.id)
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
                fileTabsService.activateTab(value);
            }}
        >
            <DLayout layoutGap={"0"} topContent={<FileTabsList
                controls={
                    <ButtonGroup color={"primary"} p={0} style={{boxShadow: "none"}}>
                        <Menu>
                            <MenuTrigger asChild>
                                <Button variant="none" paddingSize={"xxs"} color="primary">
                                    <IconPlus size={12}/>
                                </Button>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent align="start" sideOffset={8}>
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
                                <MenuContent align="end" sideOffset={8}>
                                    <MenuItem onClick={() => fileTabsService.clearAll()}>Close all tabs</MenuItem>
                                    <MenuItem onClick={() => fileTabsService.clearWithoutActive()}>Close other
                                        tabs</MenuItem>
                                    <MenuSeparator/>
                                    <MenuItem onClick={() => fileTabsService.clearLeft()}>Close all tabs to
                                        left</MenuItem>
                                    <MenuItem onClick={() => fileTabsService.clearRight()}>Close all tabs to
                                        right</MenuItem>
                                </MenuContent>
                            </MenuPortal>
                        </Menu>
                    </ButtonGroup>
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
                <>
                    {fileTabsService.values().map((tab: FileTabsView) => (
                        <FileTabsContent key={`content-${tab.id}`} value={tab.id!}>
                            {tab.content}
                        </FileTabsContent>
                    ))}
                </>
            </DLayout>
        </FileTabs>
    );

}