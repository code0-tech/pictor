import React, {HTMLProps} from "react";
import "./Badge.style.scss"
import {Color} from "../../utils/types";

export interface BadgeType extends HTMLProps<HTMLSpanElement>{
    children: string
    //defaults to primary
    color?: Color
}

const Badge: React.FC<BadgeType> = (props) => {
    
    const {color = "primary", children, ...args} = props
    
    return <span {...args} className={`badge badge--${color}`}>
        {children}
    </span>
}

export default Badge