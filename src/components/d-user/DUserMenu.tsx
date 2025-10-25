"use client"

import React from "react"
import {Menu, MenuContent, MenuPortal, MenuProps, MenuTrigger} from "../menu/Menu"
import {DUserReactiveService} from "./DUser.service"
import {useService} from "../../utils/contextStore"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import Avatar from "../avatar/Avatar"

export interface DUserMenuProps extends MenuProps {
    userId: Scalars['UserID']['output']
}

const DUserMenu: React.FC<DUserMenuProps> = props => {
    const userService = useService(DUserReactiveService)
    const userStore = useService(DUserReactiveService)

    const currentUser = userService.getUserSession()?.user

    return React.useMemo(() => {
        return (
            <Menu {...props}>
                <MenuTrigger asChild>
                    <Avatar src={currentUser?.avatarPath ?? ""}/>
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent side={"bottom"} align={"end"} sideOffset={4}>
                        {props.children}
                    </MenuContent>
                </MenuPortal>
            </Menu>
        )
    }, [userStore])
}

export default DUserMenu