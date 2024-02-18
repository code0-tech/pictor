import React from "react";
import {Size} from "../../utils/utils";
import "./Font.style.scss"

export interface FontType {
    children: string,
    size: Size,
}

const Font: React.FC<FontType> = (props) => {
    const {size, children} = props;

    return <text className={`size__${size}`}>
        {children}
    </text>
}

export default Font