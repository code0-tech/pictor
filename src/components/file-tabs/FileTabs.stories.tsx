import {Meta} from "@storybook/react";
import {FileTabs, FileTabsContent, FileTabsList, FileTabsTrigger} from "./FileTabs";
import React from "react";
import {IconChevronDown, IconDotsVertical, IconFileLambdaFilled} from "@tabler/icons-react";
import Flex from "../flex/Flex";
import {useReactiveArrayService} from "../../utils/reactiveArrayService";
import {FileTabsView} from "./FileTabs.view";
import {FileTabsService} from "./FileTabs.service";
import Button from "../button/Button";
import Text from "../text/Text";
import {Menu, MenuContent, MenuItem, MenuPortal, MenuSeparator, MenuTrigger} from "../menu/Menu";

export default {
    title: "File Tabs",
} as Meta


export const ExampleFileTabs = () => {

    const [store, service] = useReactiveArrayService<FileTabsView, FileTabsService>(FileTabsService)
    const id = React.useId()

    React.useEffect(() => {
        const parent = document.querySelector("[data-id=" + '"' + id + '"' + "]") as HTMLDivElement
        const tabList = parent?.querySelector(".file-tabs__list-content") as HTMLDivElement
        const trigger = tabList?.querySelector("[data-value=" + '"' + service.getActiveTab()?.id + '"' + "]") as HTMLDivElement


        if (tabList && trigger) {
            const offset = (trigger.offsetLeft + (trigger.offsetWidth / 2)) - (tabList.offsetWidth / 2)
            tabList.scrollLeft = 0 //reset to 0
            tabList.scrollBy({
                left: offset,
                behavior: 'smooth'
            });
        }

    }, [service.getActiveTab()])

    const fileTabsList = React.useMemo(() => {
        return service.values().map((value, index) => {
            return <FileTabsTrigger closable={value.closeable} onClose={() => {
                service.delete(index)
            }} value={value.id!!}>{value.children}</FileTabsTrigger>
        })
    }, [store])

    const fileTabsContent = React.useMemo(() => {
        return service.values().map((value, index) => {
            return <FileTabsContent value={value.id!!}>
                {value.content}
            </FileTabsContent>
        })
    }, [store])

    const fileTabs = React.useMemo(() => {
        return <FileTabs data-id={id} value={service.getActiveTab()?.id} onValueChange={(value) => {
            service.activateTab(value)
            service.update()
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
                            {service.values().map((value) => {
                                return <MenuItem onClick={() => {
                                    service.activateTab(value.id!!)
                                    service.update()
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
                            <MenuItem onClick={() => service.clear()}> Close all tabs</MenuItem>
                            <MenuItem onClick={() => service.clearWithoutActive()}> Close other tabs</MenuItem>
                            <MenuSeparator/>
                            <MenuItem onClick={() => service.clearLeft()}> Close all tabs to left </MenuItem>
                            <MenuItem onClick={() => service.clearRight()}> Close all tabs to right </MenuItem>
                        </MenuContent>
                    </MenuPortal>
                </Menu>
            </>}>
                {fileTabsList}
            </FileTabsList>
            {fileTabsContent}
        </FileTabs>
    }, [store])

    const onClick = React.useCallback(() => {
        service.add({
            id: String(Number(service.values()[service.values().length - 1]?.id ?? 0) + 1) || "0",
            active: true,
            children: <Flex style={{gap: "0.35rem"}} align={"center"}>
                <IconFileLambdaFilled color={"#70ffb2"} size={16}/>
                {Array(service.values().length + 1).fill(0).map(() => <>Test</>)}
            </Flex>,
            content: <>
                <Flex>
                    <div>
                        <Text size={"xl"} hierarchy={"primary"} display={"block"}>Your Flow under</Text>
                        <Text size={"xl"} hierarchy={"tertiary"}>Your Control</Text>
                    </div>
                    <Flex ml={1}>
                        <Text size={"md"}hierarchy={"tertiary"}>Build business flows <br/> in no-time with <br/> CodeZero.</Text>
                    </Flex>
                </Flex>
            </>,
            closeable: true
        })
    }, [store])

    return <>
        <Flex p={0.7} pos={"absolute"} bottom={"0"}>
            <Button color={"secondary"} onClick={onClick}>Add new FileTab</Button>
        </Flex>

        {fileTabs}
    </>
}