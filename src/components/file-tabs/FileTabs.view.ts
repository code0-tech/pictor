import React from "react";

export interface FileTabsView {
    id?: string;
    closeable: boolean
    children: React.ReactNode
    content: React.ReactNode
    active: boolean,
    lastActive?: Date
    show?: boolean
}