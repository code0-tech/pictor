import React from "react";
import {Component, Code0Sizes, mergeComponentProps} from "../../utils";
import "./Spacing.style.scss"

export interface SpacingProps extends Component<HTMLDivElement> {
    spacing: Code0Sizes
}

export const Spacing: React.FC<SpacingProps> = (props) => {

    const {spacing, ...rest} = props

    return <div {...mergeComponentProps(`spacing spacing--${spacing}`, rest)}/>

}