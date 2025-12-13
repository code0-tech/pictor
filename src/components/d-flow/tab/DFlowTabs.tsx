import {useService, useStore} from "../../../utils/contextStore";
import {FileTabsService} from "../../file-tabs/FileTabs.service";
import {FileTabs, FileTabsContent, FileTabsList, FileTabsTrigger} from "../../file-tabs/FileTabs";
import React from "react";
import {Menu, MenuContent, MenuItem, MenuPortal, MenuSeparator, MenuTrigger} from "../../menu/Menu";
import {Button} from "../../button/Button";
import {IconChevronDown, IconDotsVertical, IconPlus} from "@tabler/icons-react";
import {FileTabsView} from "../../file-tabs/FileTabs.view";
import {Text} from "../../text/Text";
import {DLayout} from "../../d-layout/DLayout";
import {ButtonGroup} from "../../button-group/ButtonGroup";

export const DFlowTabs = () => {

    const fileTabsService = useService(FileTabsService)
    const fileTabsStore = useStore(FileTabsService)
    const id = React.useId()

    const activeTabId = React.useMemo(() => {
        return fileTabsStore.find((t: any) => (t as any).active)?.id ?? fileTabsService.getActiveTab()?.id;
    }, [fileTabsStore, fileTabsService]);

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
                    <ButtonGroup>
                        <Menu>
                            <MenuTrigger asChild>
                                <Button variant="none" paddingSize={"xxs"} color="primary">
                                    <IconPlus size={12}/>
                                </Button>
                            </MenuTrigger>
                            <MenuPortal>
                                <MenuContent align="center" sideOffset={8}>
                                    {fileTabsStore.map((tab: FileTabsView) => (
                                        <MenuItem key={`menu-${tab.id}`}
                                                  onClick={() => {
                                                      fileTabsService.activateTab(tab.id!)
                                                  }}>
                                            {tab.children}
                                        </MenuItem>
                                    ))}
                                    {/*TODO: Add all available nodes*/}
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
                                    <MenuItem onClick={() => fileTabsService.clear()}>Close all tabs</MenuItem>
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
                {fileTabsStore.map((tab: FileTabsView, index: number) => (
                    <FileTabsTrigger
                        key={`trigger-${tab.id}`}
                        closable={tab.closeable}
                        value={tab.id!}
                        onClose={() => fileTabsService.delete(index)}
                    >
                        {tab.children}
                    </FileTabsTrigger>
                ))}
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