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
        "primary": <IconCircleDot size={18}/>,
        "secondary": <IconCircleDot size={18}/>,
        "info": <IconInfoCircle size={18}/>,
        "success": <IconCircleCheck size={18}/>,
        "warning": <IconAlertCircle size={18}/>,
        "error": <IconCircleX size={18}/>,
    }

    return <div {...mergeCode0Props(`alert alert--${color}`, rest)}>
        {icons[color]}
        {children}
    </div>
}