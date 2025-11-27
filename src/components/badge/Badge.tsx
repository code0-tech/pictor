import React from "react";
import "./Badge.style.scss"
import {Code0Component, Color} from "../../utils/types";
import {mergeCode0Props} from "../../utils/utils";

export interface BadgeType extends Code0Component<HTMLSpanElement>{
    children: React.ReactNode
    //defaults to primary
    color?: Color
    border?: boolean
}

export const Badge: React.FC<BadgeType> = (props) => {
    
    const {color = "primary", border = false, children, ...args} = props
    
    return <span {...mergeCode0Props(`badge badge--${color} ${!border ? "badge--border" : ""}`, args)}>
        {children}
    </span>
}