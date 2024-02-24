import React, {HTMLProps} from "react";
import {Size} from "../../utils/types";
import "./Text.style.scss"

export interface FontType extends Omit<Omit<HTMLProps<HTMLSpanElement>, "children">, "size"> {
    children: string,
    size: Size,
}

const Text: React.FC<FontType> = ({ size, children, ...rest }) => {

    return <span {...rest} className={`text size--${size}`}>
        {children}
    </span>
}

export default Text