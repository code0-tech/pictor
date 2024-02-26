import React, {HTMLProps} from "react";
import {Size} from "../../utils/types";
import "./Text.style.scss"

export interface FontType extends Omit<Omit<HTMLProps<HTMLSpanElement>, "children">, "size"> {
    children: string,
    size: Size,
    hierarchy?: "primary" | "secondary" | "tertiary"
}

const Text: React.FC<FontType> = ({ size, children , hierarchy = "secondary", ...rest }) => {

    return <span {...rest} className={`text text--${hierarchy} text--${size}`}>
        {children}
    </span>
}

export default Text