import React from "react";
import {Color, ComponentProps, springs, useObservedValue, useReducedMotionSafe} from "../../utils";
import {Item, Root, ToggleGroupItemProps, ToggleGroupSingleProps} from "@radix-ui/react-toggle-group";
import {mergeComponentProps} from "../../utils";
import "./SegmentedControl.style.scss"
import {motion} from "motion/react";

type SegmentedControlProps = ComponentProps & ToggleGroupSingleProps & {color?: Color}
type SegmentedControlItemProps = ComponentProps & ToggleGroupItemProps

//the selected background is one shared element that slides between the items,
//so the selected value and the layout id both have to come from the root
const SegmentedControlContext = React.createContext<{ value?: string, layoutId: string }>({layoutId: "segmented-control__indicator"})

export const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
    const [value, onValueChange] = useObservedValue(props.value, props.defaultValue, props.onValueChange)
    const layoutId = React.useId()

    return <SegmentedControlContext.Provider value={{value, layoutId}}>
        <Root {...mergeComponentProps(`segmented-control segmented-control--${props.color ?? "secondary"}`, props) as SegmentedControlProps}
              onValueChange={onValueChange}/>
    </SegmentedControlContext.Provider>
}

export const SegmentedControlItem: React.FC<SegmentedControlItemProps> = (props) => {
    const {value, layoutId} = React.useContext(SegmentedControlContext)
    const reduced = useReducedMotionSafe()

    const selected = value === props.value

    //the indicator is a sibling of the item instead of a child, so an item
    //rendered with asChild keeps its single child
    return <span className={"segmented-control__item-wrapper"}>
        {selected && <motion.span layoutId={layoutId}
                                  className={"segmented-control__indicator"}
                                  aria-hidden={true}
                                  transition={reduced ? {duration: 0} : springs.ui}/>}
        <Item {...mergeComponentProps("segmented-control__item", props) as SegmentedControlItemProps}/>
    </span>
}
