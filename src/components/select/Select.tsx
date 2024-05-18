import React from "react";
import {
    Select as AriaKitSelect,
    SelectItem as AKSelectItem,
    SelectPopover as AKSelectPopover,
    SelectSeparator as AKSelectSeparator,
    SelectGroup as AKSelectGroup,
    SelectGroupLabel as AKSelectGroupLabel,
    SelectProps,
    SelectProviderProps,
    SelectItemProps,
    SelectPopoverProps,
    SelectSeparatorProps,
    SelectGroupProps,
    SelectGroupLabelProps
} from "@ariakit/react";
import {Code0ComponentProps} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

import "./Select.style.scss"

type SelectType = Code0ComponentProps & SelectProps
type SelectItemType = Code0ComponentProps & SelectItemProps
type SelectPopoverType = Code0ComponentProps & SelectPopoverProps
type SelectSeparatorType = Code0ComponentProps & SelectSeparatorProps
type SelectGroupType = Code0ComponentProps & SelectGroupProps
type SelectGroupLabelType = Code0ComponentProps & SelectGroupLabelProps

const Select: React.FC<SelectType> = (props) => <AriaKitSelect {...mergeCode0Props("select", props)}/>
const SelectItem: React.FC<SelectItemType> = (props) => <AKSelectItem {...mergeCode0Props("select__item", props)}/>
const SelectPopover: React.FC<SelectPopoverType> = (props) => <AKSelectPopover {...mergeCode0Props("select__popover", props)}/>
const SelectSeparator: React.FC<SelectSeparatorType> = (props) => <AKSelectSeparator {...mergeCode0Props("select__separator", props)}/>
const SelectGroup: React.FC<SelectGroupType> = (props) => <AKSelectGroup {...mergeCode0Props("select__group", props)}/>
const SelectGroupLabel: React.FC<SelectGroupLabelType> = (props) => <AKSelectGroupLabel {...mergeCode0Props("select__group-label", props)}/>

export default Object.assign(Select, {
    Item: SelectItem,
    Popover: SelectPopover,
    Separator: SelectSeparator,
    Group: SelectGroup,
    GroupLabel: SelectGroupLabel,
})