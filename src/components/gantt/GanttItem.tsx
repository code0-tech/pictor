import React from "react"
import {Component, mergeComponentProps} from "../../utils"

export interface GanttItem {
    start: number
    end: number
    data?: any | {
        displayMessage: string
        color: string
    }
    type?: string | "group"
    id: string
}

export interface GanttItemProps extends Omit<Component<HTMLDivElement>, 'children'> {
    children: React.ReactNode
}

export const GanttItem: React.FC<GanttItemProps> = (props) => {

    const {children, ...rest} = props

    return <div key={rest.id} data-gantt-id={rest.id} {...mergeComponentProps('gantt__item', rest)}>
        {children}
    </div>
}