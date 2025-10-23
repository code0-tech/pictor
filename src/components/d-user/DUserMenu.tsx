"use client"

import {Code0Component} from "../../utils/types"
import React from "react"
import {Menu} from "../menu/Menu"

export interface DUserMenuProps extends Code0Component<HTMLDivElement> {
}

const DUserMenu: React.FC<DUserMenuProps> = props => {

    return React.useMemo(() => {
        return (
            <Menu>

            </Menu>
        )
    }, [])
}