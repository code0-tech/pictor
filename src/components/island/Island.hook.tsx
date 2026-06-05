import {create} from "zustand";
import React from "react";
import {IconAlertCircle, IconCircleCheck, IconCircleX, IconInfoCircle} from "@tabler/icons-react";
import {Text} from "../text/Text";

export interface IslandNotificationProps {
    id?: number
    icon: React.ReactNode
    message: React.ReactNode
    content?: React.ReactNode
    duration?: number
    index?: number
}

export const useIsland = create<{
    toasts: IslandNotificationProps[],
    addToast: (toast: IslandNotificationProps) => void,
    removeToast: (id: number) => void
}>((set) => ({
    toasts: [],
    addToast: (toast: IslandNotificationProps) => {
        const id = Date.now()
        set(state => ({toasts: [...state.toasts, {id, ...toast}]}))
    },
    removeToast: (id: number) => {
        set(state => ({toasts: state.toasts.filter(t => t.id !== id)}))
    }
}))

export const addIslandNotification = (toast: IslandNotificationProps) => {
    useIsland.getState().addToast(toast)
}

export const addIslandInfoNotification = (toast: Partial<IslandNotificationProps>) => {
    useIsland.getState().addToast({
        icon: <IconInfoCircle color={"#70ffb2"} size={16}/>,
        message: <Text c={"#70ffb2"}>{toast.message}</Text>,
        ...toast
    })
}

export const addIslandSuccessNotification = (toast: Partial<IslandNotificationProps>) => {
    useIsland.getState().addToast({
        icon: <IconCircleCheck color={"#29BF12"} size={16}/>,
        message: <Text c={"#29BF12"}>{toast.message}</Text>,
        index: 1,
        ...toast
    })
}

export const addIslandWarningNotification = (toast: Partial<IslandNotificationProps>) => {
    useIsland.getState().addToast({
        icon: <IconAlertCircle color={"#FFBE0B"} size={16}/>,
        message: <Text c={"#FFBE0B"}>{toast.message}</Text>,
        index: 2,
        ...toast
    })
}

export const addIslandErrorNotification = (toast: Partial<IslandNotificationProps>) => {
    useIsland.getState().addToast({
        icon: <IconCircleX color={"#D90429"} size={16}/>,
        message: <Text c={"#D90429"}>{toast.message}</Text>,
        index: 3,
        ...toast
    })
}