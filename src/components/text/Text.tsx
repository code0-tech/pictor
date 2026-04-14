import React from "react";
import {Sizes, Component, mergeComponentProps} from "../../utils";
import "./Text.style.scss"

export interface FontType extends Omit<Omit<Component<HTMLSpanElement>, "children">, "size"> {
    children: React.ReactNode,
    //defaults to lg
    size?: Sizes,
    hierarchy?: "primary" | "secondary" | "tertiary"
}

export const Text: React.FC<FontType> = ({size = "sm", children, hierarchy = "secondary", ...rest}) => {

    return <span {...mergeComponentProps(`text text--${hierarchy} text--${size}`, rest)}>
        {children}
    </span>
}