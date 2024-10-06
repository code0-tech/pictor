import React from "react";
import {Code0Component, Code0Sizes} from "../../utils/types";
import "./Text.style.scss"
import {mergeCode0Props} from "../../utils/utils";

export interface FontType extends Omit<Omit<Code0Component<HTMLSpanElement>, "children">, "size"> {
    children: React.ReactNode,
    //defaults to lg
    size?: Code0Sizes,
    hierarchy?: "primary" | "secondary" | "tertiary"
}

const Text: React.FC<FontType> = ({size = "sm", children, hierarchy = "secondary", ...rest}) => {

    return <span {...mergeCode0Props(`text text--${hierarchy} text--${size}`, rest)}>
        {children}
    </span>
}

export default Text