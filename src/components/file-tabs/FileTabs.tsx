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
import {ComponentProps, mergeComponentProps} from "../../utils";
import "./FileTabs.style.scss"
import {IconX} from "@tabler/icons-react";
import {ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport} from "../scroll-area/ScrollArea";

type FileTabsProps = ComponentProps & TabsProps
type FileTabsListProps = ComponentProps & TabsListProps & { controls?: React.ReactNode };
type FileTabsTriggerProps = ComponentProps & TabsTriggerProps & { onClose?: () => void, closable?: boolean }
type FileTabsContentProps = ComponentProps & TabsContentProps

export const FileTabs: React.FC<FileTabsProps> = (props) => {
    return <Tabs data-slot="tabs" {...mergeComponentProps("file-tabs", props)}/>
}

export const FileTabsList: React.FC<FileTabsListProps> = (props) => {
    return <List data-slot="tabs" {...mergeComponentProps("file-tabs__list", props)}>
        <div className={"file-tabs__list-content"}> {props.children}</div>
        {props.controls ? <div className={"file-tabs__list-controls"}>
            {props.controls}
        </div> : null}
    </List>
}

export const FileTabsTrigger: React.FC<FileTabsTriggerProps> = (props) => {
    return <Trigger data-slot="tabs"
                    data-value={props.value} {...mergeComponentProps("file-tabs__trigger", props) as FileTabsTriggerProps}>
        {props.children}
        {props.closable ? <div className={"file-tabs__trigger-icon"} onClick={props.onClose}>
            <IconX size={12}/>
        </div> : null}
    </Trigger>
}

export const FileTabsContent: React.FC<FileTabsContentProps> = ({children, ...props}) => {
    return <Content data-slot="tabs" {...mergeComponentProps("file-tabs__content", props) as FileTabsContentProps}>
        <ScrollArea h={"100%"}>
            <ScrollAreaViewport>
                {children}
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation={"vertical"}>
                <ScrollAreaThumb/>
            </ScrollAreaScrollbar>
        </ScrollArea>
    </Content>
}