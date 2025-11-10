import React from "react";
import {Code0ComponentProps, mergeCode0Props} from "../../utils";
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
import "./Tab.style.scss"

export type TabProps = Code0ComponentProps & TabsProps
export type TabListProps = Code0ComponentProps & TabsListProps;
export type TabTriggerProps = Code0ComponentProps & TabsTriggerProps
export type TabContentProps = Code0ComponentProps & TabsContentProps

export const Tab: React.FC<TabProps> = (props) => {
    return <Tabs data-slot="tabs" {...mergeCode0Props("tab", props)}/>
}

export const TabList: React.FC<TabListProps> = (props) => {
    return <List data-slot="tabs" {...mergeCode0Props("tab__list", props)}/>
}

export const TabTrigger: React.FC<TabTriggerProps> = (props) => {
    return <Trigger data-slot="tabs"
                    data-value={props.value}
                    {...mergeCode0Props("tab__trigger", props) as TabTriggerProps}/>

}

export const TabContent: React.FC<TabContentProps> = (props) => {
    return <Content data-slot="tabs" {...mergeCode0Props("tab__content", props) as TabContentProps}/>
}