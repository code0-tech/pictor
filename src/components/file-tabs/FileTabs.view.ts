import React from "react";

export interface FileTabsView {
    closeable: boolean
    children: React.ReactNode
    content: React.ReactNode
}