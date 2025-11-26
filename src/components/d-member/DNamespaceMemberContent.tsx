import React from "react";
import {Flex} from "../flex/Flex";
import {NamespaceMember} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DNamespaceMemberReactiveService} from "./DNamespaceMember.service";
import {DUserReactiveService} from "../d-user";
import {DNamespaceRoleReactiveService} from "../d-role";
import {Avatar} from "../avatar/Avatar";
import {Text} from "../text/Text";
import {Badge} from "../badge/Badge";
import {IconDots, IconMailCheck} from "@tabler/icons-react";
import {Button} from "../button/Button";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {DNamespaceRolePermissions} from "../d-role/DNamespaceRolePermissions";

export interface DNamespaceMemberContentProps {
    memberId: NamespaceMember['id']
}

export const DNamespaceMemberContent: React.FC<DNamespaceMemberContentProps> = (props) => {

    const {memberId} = props
    const memberService = useService(DNamespaceMemberReactiveService)
    const memberStore = useStore(DNamespaceMemberReactiveService)
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)

    const member = React.useMemo(() => memberService.getById(memberId), [memberStore, memberId])
    const user = React.useMemo(() => userService.getById(member?.user?.id), [userStore, member])
    const assignedRoles = React.useMemo(() => member?.roles?.nodes?.map(role => roleService.getById(role?.id)) || [], [roleStore, member])

    return <Flex align={"center"} style={{gap: "1.3rem"}} justify={"space-between"}>
        <Flex style={{gap: "1.3rem"}} align={"center"}>
            <Flex align={"center"} style={{gap: ".7rem"}}>
                <Avatar identifier={user?.username!!} bg={"transparent"}/>
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size={"md"} hierarchy={"primary"}>@{user?.username}</Text>
                    <Text size={"sm"} hierarchy={"tertiary"}>{user?.email}</Text>
                </Flex>
            </Flex>
            {assignedRoles.length > 0 ? (
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size="xs" hierarchy="tertiary">
                        Assigned roles
                    </Text>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        {assignedRoles.map(role => {
                            return <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge color={"info"}>
                                        <Text style={{color: "inherit"}}
                                              hierarchy={"tertiary"}>{role?.name}</Text>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipPortal>
                                    <TooltipContent side={"bottom"}>
                                        <DNamespaceRolePermissions abilities={role?.abilities!!}/>
                                        <TooltipArrow/>
                                    </TooltipContent>
                                </TooltipPortal>
                            </Tooltip>
                        })}
                    </Flex>
                </Flex>
            ) : null}
        </Flex>
        <Flex align={"center"} style={{gap: "1.3rem"}}>
            <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                <Flex style={{gap: "0.35rem"}} align={"center"}>
                    {user?.admin ? <Badge color={"primary"}>
                        <Text hierarchy={"tertiary"}>Owner</Text>
                    </Badge> : null}
                    {user?.emailVerifiedAt ? (
                        <Badge color={"primary"}>
                            <IconMailCheck size={16}/>
                            <Text hierarchy={"tertiary"}>Email verified</Text>
                        </Badge>
                    ) : null}
                </Flex>
            </Flex>
            {member?.userAbilities?.deleteMember || member?.userAbilities?.assignMemberRoles ? (
                <Button color="secondary">
                    <IconDots size={16}/>
                </Button>
            ) : null}
        </Flex>
    </Flex>
}