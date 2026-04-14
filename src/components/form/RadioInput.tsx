import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import React from "react";
import {ComponentProps, mergeComponentProps} from "../../utils";
import "./Input.style.scss"

export type RadioInputProps = ComponentProps & RadixRadioGroup.RadioGroupItemProps & { label: React.ReactNode }

export const RadioInput: React.FC<RadioInputProps> = (props) => {
    return <div {...mergeComponentProps(`input radio-input`, {})}>
        <RadixRadioGroup.RadioGroupItem {...mergeComponentProps("radio-input__button", props) as RadioInputProps}>
            <RadixRadioGroup.RadioGroupIndicator className={"radio-input__indicator"}/>
        </RadixRadioGroup.RadioGroupItem>
        <div className={`input__right input__right--action}`}>
            {props.label}
        </div>
    </div>
}