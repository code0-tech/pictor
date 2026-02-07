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
import {Button} from "../button/Button";

export interface ToastProps extends Omit<Code0Component<HTMLDivElement>, "title" | "id"> {
    children?: React.ReactNode | React.ReactNode[]
    id: string | number
    title: React.ReactNode
    //defaults to true
    color?: Color
    //defaults to false
    dismissible?: boolean
    onClose?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
    duration?: number //defaults to 4000
}

export function toast(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast id={id} {...toast}>
            {toast.children}
        </Toast>
    ), {
        duration: toast.duration ?? 4000
    })
}

export function Toast(props: ToastProps) {
    const {dismissible = false, color = "secondary", title, onClose = () => {}, children, duration = 4000, ...rest} = props

    return (
        <div {...mergeCode0Props(`toast toast--${color}`, rest)}>
            <Flex className={"toast__header"}>
                <Flex className={"toast__header-wrapper"}>
                    {color && <ToastIcon color={color as Color}/>}
                    <Text size={"md"}>{title}</Text>
                </Flex>
                {dismissible &&
                    <Button variant={"none"} paddingSize={"xxs"} color={color as Color} className={"toast__dismissible"} onClick={() => sonnerToast.dismiss(props.id)}>
                        <IconX size={16}/>
                    </Button>
                }
            </Flex>
            {children &&
                <div className={"toast__content"}>
                    {children}
                </div>
            }
            <Flex className={"toast__duration"} style={{
                ["--toast-duration" as any]: `${duration}ms`,
            }}>
                <Text hierarchy={"tertiary"}>This message will close in</Text> <Text hierarchy={"primary"}>{duration / 1000}</Text> <Text>seconds</Text>
            </Flex>
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