'use client'

import React, {ReactNode} from 'react'
import { toast as sonnerToast } from 'sonner'
import "./Toast.style.scss"
import {Code0Component, Color} from "../../utils/types"
import {mergeCode0Props} from "../../utils/utils"
import {IconAlertCircle, IconCircleCheck, IconCircleMinus, IconCircleX, IconLoaderQuarter, IconX} from "@tabler/icons-react"
import {Text} from "../text/Text"

type ToastType = "success" | "info" | "warning" | "error" | "loading"

export interface ToastProps extends Omit<Code0Component<HTMLDivElement>, "title" | "id"> {
    children?: ReactNode | ReactNode[]
    id: string | number
    title: ReactNode
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
            onClose={toast.onClose}
        >
            {toast.children}
        </Toast>
    ))
}

export function Toast(props: ToastProps) {
    const {color = "primary", dismissible = false, type, title, onClose = () => {}, children, ...rest} = props

    return (
        <div {...mergeCode0Props("toast", rest)}>
            <div className={"toast__header"}>
                <div className={"toast_header-wrapper"}>
                    {type && <ToastIcon type={type}/>}
                    <Text size={"sm"} className={"toast__heading"}>{title}</Text>
                </div>
                {dismissible &&
                    <span className={"toast__dismissible"} onClick={onClose}>
                        <IconX/>
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
        success: <IconCircleCheck size={24} className={"toast__icon"} />,
        info: <IconAlertCircle size={24} className={"toast__icon"}/>,
        warning: <IconCircleMinus size={24} className={"toast__icon"}/>,
        error: <IconCircleX size={24} className={"toast__icon"}/>,
        loading: <IconLoaderQuarter size={24} className={"toast__icon"}/>
    }

    return icons[type] ?? null
}