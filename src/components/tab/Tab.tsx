import React from "react";
import {ComponentProps, mergeComponentProps} from "../../utils";
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

export type TabProps = ComponentProps & TabsProps
export type TabListProps = ComponentProps & TabsListProps;
export type TabTriggerProps = ComponentProps & TabsTriggerProps
export type TabContentProps = ComponentProps & TabsContentProps

export const Tab: React.FC<TabProps> = (props) => {
    return <Tabs data-slot="tabs" {...mergeComponentProps("tab", props)}/>
}

export const TabList: React.FC<TabListProps> = (props) => {
    return <List data-slot="tabs" {...mergeComponentProps("tab__list", props)}/>
}

export const TabTrigger: React.FC<TabTriggerProps> = (props) => {
    return <Trigger data-slot="tabs"
                    data-value={props.value}
                    {...mergeComponentProps("tab__trigger", props) as TabTriggerProps}/>

}

export const TabContent: React.FC<TabContentProps> = (props) => {
    return <Content data-slot="tabs" {...mergeComponentProps("tab__content", props) as TabContentProps}/>
}