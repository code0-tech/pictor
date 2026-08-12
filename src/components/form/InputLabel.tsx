import React from "react";
import {Component, mergeComponentProps} from "../../utils";

export interface InputLabelProps extends Component<HTMLLabelElement> {
    children: React.ReactNode | React.ReactElement
}

export const InputLabel: React.FC<InputLabelProps> = (props) => {

    const {children, ...args} = props

    return <label {...mergeComponentProps("input__label", args)}>
        {children}
    </label>

}
