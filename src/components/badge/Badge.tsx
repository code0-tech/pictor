import React from "react";
import "./Badge.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface BadgeType extends Code0Component<HTMLSpanElement>{
    children: React.ReactNode
    //defaults to primary
    color?: Color
}

export const Badge: React.FC<BadgeType> = (props) => {
    
    const {color = "primary", children, ...args} = props
    
    return <span {...mergeCode0Props(`badge badge--${color}`, args)}>
        {children}
    </span>
}