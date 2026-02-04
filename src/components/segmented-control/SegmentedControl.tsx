import React from "react";
import {Code0ComponentProps, Color} from "../../utils";
import {ToggleGroupSingleProps, ToggleGroupItemProps, Root, Item} from "@radix-ui/react-toggle-group";
import {mergeCode0Props} from "../../utils";
import "./SegmentedControl.style.scss"

type SegmentedControlProps = Code0ComponentProps & ToggleGroupSingleProps & {color?: Color}
type SegmentedControlItemProps = Code0ComponentProps & ToggleGroupItemProps

export const SegmentedControl: React.FC<SegmentedControlProps> = (props) => {
    return <Root {...mergeCode0Props(`segmented-control segmented-control--${props.color ?? "secondary"}`, props) as SegmentedControlProps}/>
}

export const SegmentedControlItem: React.FC<SegmentedControlItemProps> = (props) => {
    return <Item {...mergeCode0Props("segmented-control__item", props) as SegmentedControlItemProps}/>
}