"use client"

import {Code0Component} from "../../../utils/types"
import React from "react"
import {Menu} from "../../menu/Menu"

export interface DNamespaceProjectMenuProps extends Code0Component<HTMLDivElement> {
}

const DNamespaceProjectMenu: React.FC<DNamespaceProjectMenuProps> = props => {

    return React.useMemo(() => {
        return (
            <Menu>

            </Menu>
        )
    }, [])
}