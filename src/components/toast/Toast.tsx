'use client'

import React from 'react'
import { toast as sonnerToast } from 'sonner'
import "./Toast.style.scss"
import {Code0Component, Color} from "../../utils"
import {mergeCode0Props} from "../../utils"
import {
    IconAlertCircle,
    IconCircleCheck, IconCircleDot,
    IconCircleX, IconInfoCircle,
    IconProps,
    IconX
} from "@tabler/icons-react"
import {Text} from "../text/Text"
import {Flex} from "../flex/Flex";

export interface ToastProps extends Omit<Code0Component<HTMLDivElement>, "title" | "id"> {
    children?: React.ReactNode | React.ReactNode[]
    id: string | number
    title: React.ReactNode
    //defaults to true
    color?: Color
    //defaults to false
    dismissible?: boolean
    onClose?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

export function toast(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast id={id} {...toast}>
            {toast.children}
        </Toast>
    ))
}

export function Toast(props: ToastProps) {
    const {dismissible = false, color = "secondary", title, onClose = () => {}, children, ...rest} = props

    return (
        <div {...mergeCode0Props(`toast toast--${color}`, rest)}>
            <Flex className={"toast__header"}>
                <Flex align={"center"} className={"toast__header-wrapper"}>
                    {color && <ToastIcon color={color}/>}
                    <Text size={"md"} hierarchy={"primary"}>{title}</Text>
                </Flex>
                {dismissible &&
                    <span className={"toast__dismissible"} onClick={() => sonnerToast.dismiss(props.id)}>
                        <IconX size={16}/>
                    </span>
                }
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
        "primary": <IconCircleDot size={16}/>,
        "secondary": <IconCircleDot size={16}/>,
        "info": <IconInfoCircle size={16}/>,
        "success": <IconCircleCheck size={16}/>,
        "warning": <IconAlertCircle size={16}/>,
        "error": <IconCircleX size={16}/>,
    }

    return icons[color] ?? null
}