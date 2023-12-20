import React, {HTMLProps} from "react";
import "./Badge.style.scss"

export interface BadgeType extends HTMLProps<HTMLSpanElement>{
    children: string
    //defaults to primary
    variant?: "primary" | "secondary" | "info" | "success" | "warning" | "error"
}

const Badge: React.FC<BadgeType> = (props) => {
    
    const {variant, children, ...args} = props
    
    return <span {...args} className={`badge`}>
        {children}
    </span>
}

export default Badge