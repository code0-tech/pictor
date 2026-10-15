import React from "react";
import {ComponentProps, mergeComponentProps, springs, useObservedValue, useReducedMotionSafe} from "../../utils";
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
import {motion} from "motion/react";

export type TabProps = ComponentProps & TabsProps
export type TabListProps = ComponentProps & TabsListProps;
export type TabTriggerProps = ComponentProps & TabsTriggerProps
export type TabContentProps = ComponentProps & TabsContentProps

//the indicator is one shared element that travels between the triggers, so the
//selected value and the layout id both have to come from the root
const TabValueContext = React.createContext<{
    value?: string,
    layoutId: string,
    orientation: "horizontal" | "vertical"
}>({layoutId: "tab__indicator", orientation: "horizontal"})

export const Tab: React.FC<TabProps> = (props) => {
    const [value, onValueChange] = useObservedValue(props.value, props.defaultValue, props.onValueChange)
    const layoutId = React.useId()

    return <TabValueContext.Provider value={{value, layoutId, orientation: props.orientation ?? "horizontal"}}>
        <Tabs data-slot="tabs" {...mergeComponentProps("tab", props)} onValueChange={onValueChange}/>
    </TabValueContext.Provider>
}

export const TabList: React.FC<TabListProps> = (props) => {
    return <List data-slot="tabs" {...mergeComponentProps("tab__list", props)}/>
}

export const TabTrigger: React.FC<TabTriggerProps> = (props) => {
    const {value, layoutId, orientation} = React.useContext(TabValueContext)
    const reduced = useReducedMotionSafe()

    const selected = value !== undefined && value === props.value

    //the indicator is a sibling of the trigger instead of a child, so a trigger
    //rendered with asChild keeps its single child
    return <span className={"tab__trigger-wrapper"} data-orientation={orientation}>
        <Trigger data-slot="tabs"
                 data-value={props.value}
                 {...mergeComponentProps("tab__trigger", props) as TabTriggerProps}/>
        {selected && <motion.span layoutId={layoutId}
                                  className={"tab__indicator"}
                                  aria-hidden={true}
                                  transition={reduced ? {duration: 0} : springs.ui}>
            <span className={"tab__indicator-bar"}/>
        </motion.span>}
    </span>

}

export const TabContent: React.FC<TabContentProps> = (props) => {
    return <Content data-slot="tabs" {...mergeComponentProps("tab__content", props) as TabContentProps}/>
}
