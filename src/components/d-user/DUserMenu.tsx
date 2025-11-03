"use client"

import React from "react"
import {Menu, MenuContent, MenuPortal, MenuProps, MenuTrigger} from "../menu/Menu"
import {DUserReactiveService} from "./DUser.service"
import {useService} from "../../utils/contextStore"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import Avatar from "../avatar/Avatar"
import Text from "../text/Text"
import Row from "../row/Row"
import Flex from "../flex/Flex";

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
    }, [userStore])
}

export default DUserMenu