import * as RadixSelect from "@radix-ui/react-select";
import {Color, ComponentProps, mergeComponentProps} from "../../utils";
import React from "react";
import {InputWrapper, InputWrapperProps} from "./InputWrapper";
import "./SelectInput.style.scss"

export type SelectInputProps = InputWrapperProps
export type SelectProps = SelectInputProps & RadixSelect.SelectProps
export type SelectTriggerProps = ComponentProps & RadixSelect.SelectTriggerProps
export type SelectValueProps = ComponentProps & RadixSelect.SelectValueProps
export type SelectContentProps = ComponentProps & RadixSelect.SelectContentProps & {
    color?: Color
}
export type SelectPortalProps = ComponentProps & RadixSelect.SelectPortalProps
export type SelectViewportProps = ComponentProps & RadixSelect.SelectViewportProps
export type SelectItemProps = ComponentProps & RadixSelect.SelectItemProps
export type SelectItemTextProps = ComponentProps & RadixSelect.SelectItemTextProps

export const SelectInput: React.FC<SelectProps> = (props) => {

    const {title, description, left, leftType, rightType, right, formValidation, ...rest} = props

    return <InputWrapper title={title}
                         description={description}
                         left={left}
                         leftType={leftType}
                         right={right}
                         rightType={rightType}
                         formValidation={formValidation}>
        <RadixSelect.Root {...mergeComponentProps("select-input", {
            ...rest, onValueChange: (value: string) => {
                formValidation?.setValue(value)
                rest.onValueChange?.(value)
            }
        }) as SelectProps}/>
    </InputWrapper>
}

export const SelectTrigger: React.FC<SelectTriggerProps> = (props) => {
    return <RadixSelect.Trigger {...mergeComponentProps("select-input__trigger", props)}/>
}

export const SelectValue: React.FC<SelectValueProps> = (props) => {
    return <RadixSelect.Value {...mergeComponentProps("select-input__value", props)}/>
}

export const SelectContent: React.FC<SelectContentProps> = (props) => {
    return <RadixSelect.Content {...mergeComponentProps(`select-input__content select-input__content--${props.color ?? "primary"}`, props) as SelectContentProps}/>
}

export const SelectPortal: React.FC<SelectPortalProps> = (props) => {
    return <RadixSelect.Portal {...mergeComponentProps("select-input__portal", props) as SelectPortalProps}/>
}

export const SelectViewport: React.FC<SelectViewportProps> = (props) => {
    return <RadixSelect.Viewport {...mergeComponentProps("select-input__viewport", props)}/>
}

export const SelectItem: React.FC<SelectItemProps> = (props) => {
    return <RadixSelect.Item {...mergeComponentProps("select-input__item", props) as SelectItemProps}/>
}

export const SelectItemText: React.FC<SelectItemTextProps> = (props) => {
    return <RadixSelect.ItemText {...mergeComponentProps("select-input__item-text", props) as SelectItemTextProps}/>
}





