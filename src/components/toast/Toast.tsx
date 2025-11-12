'use client'

import React from 'react'
import { toast as sonnerToast } from 'sonner'
import "./Toast.style.scss"
import {Code0Component, Color} from "../../utils/types"
import {mergeCode0Props} from "../../utils/utils"
import {IconAlertCircle, IconCircleCheck, IconCircleMinus, IconCircleX, IconLoaderQuarter, IconX} from "@tabler/icons-react"
import {Text} from "../text/Text"
import {Flex} from "../flex/Flex";

type ToastType = "success" | "info" | "warning" | "error" | "loading"

export interface ToastProps extends Omit<Code0Component<HTMLDivElement>, "title" | "id"> {
    children?: React.ReactNode | React.ReactNode[]
    id: string | number
    title: React.ReactNode
    //defaults to primary
    color?: Color
    //defaults to true
    type?: ToastType
    //defaults to false
    dismissible?: boolean
    onClose?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

export function toast(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            title={toast.title}
            color={toast.color}
            type={toast.type}
            dismissible={toast.dismissible}
        >
            {toast.children}
        </Toast>
    ), {
        duration: 10000000
    })
}

export function Toast(props: ToastProps) {
    const {dismissible = false, type, title, onClose = () => {}, children, ...rest} = props

    return (
        <div {...mergeCode0Props("toast", rest)}>
            <div className={"toast__header"}>
                <Flex align={"center"}>
                    {type && <ToastIcon type={type}/>}
                    <Text size={"md"} hierarchy={"primary"}>{title}</Text>
                </Flex>
                {dismissible &&
                    <span className={"toast__dismissible"} onClick={() => sonnerToast.dismiss(props.id)}>
                        <IconX size={16}/>
                    </span>
                }
            </div>
            {children &&
                <div className={"toast__content"}>
                    {children}
                </div>
            }
        </div>
    )
}

const ToastIcon: React.FC<{type: ToastType}> = ({ type }) => {
    const icons = {
        success: <IconCircleCheck size={16} className={"toast__icon"} />,
        info: <IconAlertCircle size={16} className={"toast__icon"}/>,
        warning: <IconCircleMinus size={16} className={"toast__icon"}/>,
        error: <IconCircleX size={16} className={"toast__icon"}/>,
        loading: <IconLoaderQuarter size={16} className={"toast__icon"}/>
    }

    return icons[type] ?? null
}