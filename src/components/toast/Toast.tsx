"use client"


import { Toaster as Sonner, type ToasterProps } from "sonner"
import "./Toast.style.scss"
import React from "react"
import {IconAlertCircle, IconCircleCheck, IconCircleMinus, IconCircleX, IconLoaderQuarter} from "@tabler/icons-react"
import {Code0ComponentProps} from "../../utils/types"
import {mergeCode0Props} from "../../utils/utils"

export type ToastProps = Code0ComponentProps & ToasterProps

const Toaster = ({ ...props }: ToastProps) => {
    return (
        <Sonner
            className="toaster group"
            icons={{
                success: <IconCircleCheck size={24} />,
                info: <IconAlertCircle size={24} />,
                warning: <IconCircleMinus size={24} />,
                error: <IconCircleX size={24} />,
                loading: <IconLoaderQuarter size={24} style={}/>,
            }}
            {...mergeCode0Props("toast", props) as ToastProps}
        />
    )
}

export { Toaster }
