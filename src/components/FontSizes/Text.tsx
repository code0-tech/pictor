import React from "react";
import {Size} from "../../utils/types";
import "./Font.style.scss"

export interface FontType extends Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children">, "className"> {
    children: string,
    size: Size,
}

const Text: React.FC<FontType> = ({ size, children, ...rest }) => {

    return <span className={`size--${size}`} {...rest}>
        {children}
    </span>
}

export default Text