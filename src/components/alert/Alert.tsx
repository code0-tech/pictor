import React from "react";
import {Code0Component, Color, mergeCode0Props} from "../../utils";
import {
    IconAlertCircle,
    IconCircleCheck,
    IconCircleDot,
    IconCircleX,
    IconInfoCircle,
    IconProps
} from "@tabler/icons-react";
import "./Alert.style.scss"

export interface AlertProps extends Code0Component<HTMLDivElement> {
    color?: Color
    children: React.ReactNode
}

export const Alert: React.FC<AlertProps> = (props) => {
    const {color = "secondary", children, ...rest} = props

    const icons: Record<Color, React.ReactElement<IconProps>> = {
        "primary": <IconCircleDot size={16}/>,
        "secondary": <IconCircleDot size={16}/>,
        "info": <IconInfoCircle size={16}/>,
        "success": <IconCircleCheck size={16}/>,
        "warning": <IconAlertCircle size={16}/>,
        "error": <IconCircleX size={16}/>,
    }

    return <div {...mergeCode0Props(`alert alert--${color}`, rest)}>
        {icons[color]}
        {children}
    </div>
}