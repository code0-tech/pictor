"use client"

import React from "react"
import {Menu, MenuContent, MenuPortal, MenuProps, MenuTrigger} from "../menu/Menu"
import {DUserReactiveService} from "./DUser.service"
import {useService, useStore} from "../../utils"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Avatar} from "../avatar/Avatar"
import {Text} from "../text/Text"
import {Flex} from "../flex/Flex";

export interface DUserMenuProps extends MenuProps {
    userId: Scalars['UserID']['output']
}

const DUserMenu: React.FC<DUserMenuProps> = props => {
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const currentUser = React.useMemo(() => userService.getById(props.userId), [userStore, userService])

    return React.useMemo(() => {
        return (
            <Menu {...props}>
                <MenuTrigger asChild>
                    <Flex align={"center"} style={{gap: ".5rem"}}>
                        <Avatar src={currentUser?.avatarPath ?? ""} identifier={currentUser?.username ?? ""}/>
                        <Flex style={{flexDirection: "column"}}>
                            <Text size={"md"} hierarchy={"secondary"}>
                                {currentUser?.username}
                            </Text>
                            <Text size={"xs"} hierarchy={"tertiary"}>
                                {currentUser?.email}
                            </Text>
                        </Flex>

                    </Flex>
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent side={"bottom"} align={"start"} sideOffset={8}>
                        {props.children}
                    </MenuContent>
                </MenuPortal>
            </Menu>
        )
    }, [currentUser])
}

export default DUserMenu