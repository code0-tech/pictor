"use client"

import {Code0Component} from "../../utils/types"
import React from "react"
import {Menu} from "../menu/Menu"

export interface DOrganizationMenuProps extends Code0Component<HTMLDivElement> {
}

const DOrganizationMenu: React.FC<DOrganizationMenuProps> = props => {

    return React.useMemo(() => {
        return (
            <Menu>

            </Menu>
        )
    }, [])
}