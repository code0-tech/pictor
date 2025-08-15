import {useService, useStore} from "../../../../utils/contextStore";
import {FileTabsService} from "../../../file-tabs/FileTabs.service";
import {FileTabs, FileTabsContent, FileTabsList, FileTabsTrigger} from "../../../file-tabs/FileTabs";
import React from "react";
import {Menu, MenuContent, MenuItem, MenuPortal, MenuSeparator, MenuTrigger} from "../../../menu/Menu";
import Button from "../../../button/Button";
import {IconChevronDown, IconDotsVertical} from "@tabler/icons-react";

export const DFlowViewportFileTabs = () => {

    const fileTabsService = useService(FileTabsService)
    const fileTabsStore = useStore(FileTabsService)
    const id = React.useId()

    React.useEffect(() => {
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

    }, [fileTabsService.getActiveTab()])

    const fileTabsList = React.useMemo(() => {
        return fileTabsService.values().map((value, index) => {
            return <FileTabsTrigger closable={value.closeable} onClose={() => {
                fileTabsService.delete(index)
            }} value={value.id!!}>{value.children}</FileTabsTrigger>
        })
    }, [fileTabsStore])

    const fileTabsContent = React.useMemo(() => {
        return fileTabsService.values().map((value, index) => {
            return <FileTabsContent value={value.id!!}>
                {value.content}
            </FileTabsContent>
        })
    }, [fileTabsStore])

    return <FileTabs data-id={id} value={fileTabsService.getActiveTab()?.id} onValueChange={(value) => {
        fileTabsService.activateTab(value)
        fileTabsService.update()
    }}>
        <FileTabsList controls={<>
            <Menu>
                <MenuTrigger asChild>
                    <Button variant={"none"} color={"primary"} style={{aspectRatio: "1/1"}}>
                        <IconChevronDown size={12}/>
                    </Button>
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent align={"end"} sideOffset={8}>
                        {fileTabsService.values().map((value) => {
                            return <MenuItem onClick={() => {
                                fileTabsService.activateTab(value.id!!)
                                fileTabsService.update()
                            }}>{value.children}</MenuItem>
                        })}
                    </MenuContent>
                </MenuPortal>
            </Menu>
            <Menu>
                <MenuTrigger asChild>
                    <Button variant={"none"} color={"primary"} style={{aspectRatio: "1/1"}}>
                        <IconDotsVertical size={12}/>
                    </Button>
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent align={"end"} sideOffset={8}>
                        <MenuItem onClick={() => fileTabsService.clear()}> Close all tabs</MenuItem>
                        <MenuItem onClick={() => fileTabsService.clearWithoutActive()}> Close other tabs</MenuItem>
                        <MenuSeparator/>
                        <MenuItem onClick={() => fileTabsService.clearLeft()}> Close all tabs to left </MenuItem>
                        <MenuItem onClick={() => fileTabsService.clearRight()}> Close all tabs to right </MenuItem>
                    </MenuContent>
                </MenuPortal>
            </Menu>
        </>}>
            {fileTabsList}
        </FileTabsList>
        {fileTabsContent}

    </FileTabs>

}