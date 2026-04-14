import React from "react";
import {Component, Sizes, mergeComponentProps} from "../../utils";
import "./Spacing.style.scss"

export interface SpacingProps extends Component<HTMLDivElement> {
    spacing: Sizes
}

export const Spacing: React.FC<SpacingProps> = (props) => {

    const {spacing, ...rest} = props

    return <div {...mergeComponentProps(`spacing spacing--${spacing}`, rest)}/>

}