import React from "react";
import {Code0Component, Code0Sizes, mergeCode0Props} from "../../utils";

export interface SpacingProps extends Code0Component<HTMLDivElement> {
    spacing: Code0Sizes
}

export const Spacing: React.FC<SpacingProps> = (props) => {

    const {spacing, ...rest} = props

    return <div {...mergeCode0Props(`spacing spacing--${spacing}`, rest)}/>

}