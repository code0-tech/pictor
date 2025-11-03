import React from "react";
import {
    Content,
    List,
    Tabs,
    TabsContentProps,
    TabsListProps,
    TabsProps,
    TabsTriggerProps,
    Trigger
} from "@radix-ui/react-tabs";
import {mergeCode0Props} from "../../utils/utils";
import {Code0ComponentProps} from "../../utils/types";
import "./FileTabs.style.scss"
import {IconX} from "@tabler/icons-react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";

type FileTabsProps = Code0ComponentProps & TabsProps
type FileTabsListProps = Code0ComponentProps & TabsListProps & { controls?: React.ReactNode };
type FileTabsTriggerProps = Code0ComponentProps & TabsTriggerProps & { onClose?: () => void, closable?: boolean }
type FileTabsContentProps = Code0ComponentProps & TabsContentProps

export const FileTabs: React.FC<FileTabsProps> = (props) => {
    return <Tabs data-slot="tabs" {...mergeCode0Props("file-tabs", props)}/>
}

export const FileTabsList: React.FC<FileTabsListProps> = (props) => {
    return <List data-slot="tabs" {...mergeCode0Props("file-tabs__list", props)}>
        <div className={"file-tabs__list-content"}> {props.children}</div>
        {props.controls ? <div className={"file-tabs__list-controls"}>
            {props.controls}
        </div> : null}
    </List>
}

export const FileTabsTrigger: React.FC<FileTabsTriggerProps> = (props) => {
    return <Trigger data-slot="tabs"
                    data-value={props.value} {...mergeCode0Props("file-tabs__trigger", props) as FileTabsTriggerProps}>
        {props.children}
        {props.closable ? <div className={"file-tabs__trigger-icon"} onClick={props.onClose}>
            <IconX size={16}/>
        </div> : null}
    </Trigger>
}

export const FileTabsContent: React.FC<FileTabsContentProps> = ({children, ...props}) => {
    return <Content data-slot="tabs" {...mergeCode0Props("file-tabs__content", props) as FileTabsContentProps}>
        <ScrollArea h={"700px"}>
            <ScrollAreaViewport>
                {children}
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>
    </Content>
}