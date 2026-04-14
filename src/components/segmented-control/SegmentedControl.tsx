import React from "react";
import {ComponentProps, Color} from "../../utils";
import {ToggleGroupSingleProps, ToggleGroupItemProps, Root, Item} from "@radix-ui/react-toggle-group";
import {mergeComponentProps} from "../../utils";
import "./SegmentedControl.style.scss"

type SegmentedControlProps = ComponentProps & ToggleGroupSingleProps & {color?: Color}
type SegmentedControlItemProps = ComponentProps & ToggleGroupItemProps

export const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
    return <Root {...mergeComponentProps(`segmented-control segmented-control--${props.color ?? "secondary"}`, props) as SegmentedControlProps}/>
}

export const SegmentedControlItem: React.FC<SegmentedControlItemProps> = (props) => {
    return <Item {...mergeComponentProps("segmented-control__item", props) as SegmentedControlItemProps}/>
}