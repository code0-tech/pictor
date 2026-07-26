'use client'

import React from 'react'
import { toast as sonnerToast } from 'sonner'
import "./Toast.style.scss"
import {Component, Color} from "../../utils"
import {mergeComponentProps} from "../../utils"
import {
    IconAlertCircle,
    IconCircleCheck, IconCircleDot,
    IconCircleX, IconInfoCircle,
    IconProps
} from "@tabler/icons-react"
import {Text} from "../text/Text"
import {Flex} from "../flex/Flex";

export interface ToastProps extends Omit<Component<HTMLDivElement>, "title" | "id"> {
    children?: React.ReactNode | React.ReactNode[]
    id: string | number
    title: React.ReactNode
    //defaults to "secondary", accepts a preset Color or any custom CSS color string
    color?: Color | (string & {})
    //custom icon, overrides the default color-based icon
    icon?: React.ReactNode
    duration?: number //defaults to 4000
}

const presetColors: Color[] = ["primary", "secondary", "tertiary", "info", "success", "warning", "error"]

const isPresetColor = (color: string): color is Color => presetColors.includes(color as Color)

export function toast({wrapper, ...toast}: Omit<ToastProps, 'id'> & {wrapper?: (children: React.ReactNode) => React.ReactNode}) {
    return sonnerToast.custom((id) => {
        const element = (
            <Toast id={id} {...toast}>
                {toast.children}
            </Toast>
        )

        return <>{wrapper ? wrapper(element) : element}</>
    }, {
        duration: toast.duration ?? 4000
    })
}

export function Toast(props: ToastProps) {
    const {color = "secondary", icon, title, children, duration = 4000, ...rest} = props

    const preset = isPresetColor(color)
    //custom colors are not backed by a SCSS class, so apply them inline and fall back to the base toast styling
    const customStyle = preset ? {} : {style: {color, ...(rest as {style?: React.CSSProperties}).style}}

    return (
        <div {...mergeComponentProps(`toast toast--${preset ? color : "secondary"}`, {...rest, ...customStyle})}>
            <Flex className={"toast__header"}>
                <Flex className={"toast__header-wrapper"}>
                    {icon ?? (preset && <ToastIcon color={color}/>)}
                    <Text size={"md"} hierarchy={"primary"}>{title}</Text>
                </Flex>
            </Flex>
            {children &&
                <div className={"toast__content"}>
                    {children}
                </div>
            }
        </div>
    )
}

const ToastIcon: React.FC<{color: Color}> = ({ color }) => {
    const icons: Record<Color, React.ReactElement<IconProps>> = {
        "primary": <IconCircleDot className={"toast__icon"} size={16}/>,
        "secondary": <IconCircleDot className={"toast__icon"} size={16}/>,
        "tertiary": <IconCircleDot className={"toast__icon"} size={16}/>,
        "info": <IconInfoCircle className={"toast__icon"} size={16}/>,
        "success": <IconCircleCheck className={"toast__icon"} size={16}/>,
        "warning": <IconAlertCircle className={"toast__icon"} size={16}/>,
        "error": <IconCircleX className={"toast__icon"} size={16}/>,
    }

    return icons[color] ?? null
}