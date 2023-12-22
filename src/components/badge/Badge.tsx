import React, {HTMLProps} from "react";
import "./Badge.style.scss"

export interface BadgeType extends HTMLProps<HTMLSpanElement>{
    children: string
    //defaults to primary
    variant?: "primary" | "secondary" | "info" | "success" | "warning" | "error"
}

const Badge: React.FC<BadgeType> = (props) => {
    
    const {variant = "primary", children, ...args} = props
    
    return <span {...args} className={`badge badge--${variant}`}>
        {children}
    </span>
}

export default Badge