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

type FileTabsProps = Code0ComponentProps & TabsProps
type FileTabsListProps = Code0ComponentProps & TabsListProps
type FileTabsTriggerProps = Code0ComponentProps & TabsTriggerProps
type FileTabsContentProps = Code0ComponentProps & TabsContentProps

export const FileTabs: React.FC<FileTabsProps> = (props) => {
    return <Tabs data-slot="tabs" {...mergeCode0Props("file-tabs", props)}/>
}

export const FileTabsList: React.FC<FileTabsListProps> = (props) => {
    return <List data-slot="tabs" {...mergeCode0Props("file-tabs__list", props)}/>
}

export const FileTabsTrigger: React.FC<FileTabsTriggerProps> = (props) => {
    return <Trigger data-slot="tabs" {...mergeCode0Props("file-tabs__trigger", props) as FileTabsTriggerProps}>
        {props.children}
        <div className={"file-tabs__trigger-icon"}>
            <IconX size={16}/>
        </div>
    </Trigger>
}

export const FileTabsContent: React.FC<FileTabsContentProps> = (props) => {
    return <Content data-slot="tabs" {...mergeCode0Props("file-tabs__content", props) as FileTabsContentProps}/>
}