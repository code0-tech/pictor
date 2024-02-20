import React, {HTMLProps} from "react";
import {Size} from "../../utils/types";
import "./Text.style.scss"

export interface FontType extends Omit<Omit<Omit<HTMLProps<HTMLSpanElement>, "children">, "className">, "size"> {
    children: string,
    size: Size,
}

const Text: React.FC<FontType> = ({ size, children, ...rest }) => {

    return <span className={`size--${size}`} {...rest}>
        {children}
    </span>
}

export default Text