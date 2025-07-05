import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import React from "react";
import {mergeCode0Props} from "../../utils/utils";
import {Code0ComponentProps} from "../../utils/types";
import "./Input.style.scss"

export type RadioInputProps = Code0ComponentProps & RadixRadioGroup.RadioGroupItemProps & {label: React.ReactNode}

export const RadioInput: React.FC<RadioInputProps> = (props) => {
    return <div {...mergeCode0Props(`input radio-input`, {})}>
        <RadixRadioGroup.RadioGroupItem {...mergeCode0Props("radio-input__button", props) as RadioInputProps}>
            <RadixRadioGroup.RadioGroupIndicator className={"radio-input__indicator"}/>
        </RadixRadioGroup.RadioGroupItem>
        <div className={`input__right input__right--action}`}>
            {props.label}
        </div>
    </div>
}