"use client"

import React from "react";
import {Flex} from "../flex/Flex";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {NamespaceRole} from "@code0-tech/sagittarius-graphql-types";
import {useService, useStore} from "../../utils";
import {DNamespaceRoleReactiveService} from "./DNamespaceRole.service";
import {Text} from "../text/Text";
import {Button} from "../button/Button";
import {IconFolders, IconSettings, IconUsers} from "@tabler/icons-react";
import {DNamespaceRolePermissions} from "./DNamespaceRolePermissions";
import {DNamespaceMemberReactiveService} from "../d-member";
import {Badge} from "../badge/Badge";
import {DNamespaceProjectReactiveService} from "../d-project";
import {Tooltip, TooltipArrow, TooltipContent, TooltipPortal, TooltipTrigger} from "../tooltip/Tooltip";
import {Card} from "../card/Card";
import {Spacing} from "../spacing/Spacing";
import {Avatar} from "../avatar/Avatar";
import CardSection from "../card/CardSection";
import {DUserReactiveService} from "../d-user";

export interface DNamespaceRoleContentProps {
    roleId: NamespaceRole["id"]
    onSetting?: (role: DNamespaceRoleView) => void
}

export const DNamespaceRoleContent: React.FC<DNamespaceRoleContentProps> = (props) => {
    const {
        roleId,
        onSetting = () => {
        }
    } = props

    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)
    const projectService = useService(DNamespaceProjectReactiveService)
    const projectStore = useStore(DNamespaceProjectReactiveService)
    const memberService = useService(DNamespaceMemberReactiveService)
    const memberStore = useStore(DNamespaceMemberReactiveService)
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)

    const role = React.useMemo(() => roleService.getById(roleId), [roleStore, roleId])
    const assignedProjects = React.useMemo(() => projectService
            .values({namespaceId: role?.namespace?.id})
            .filter(project =>
                role?.assignedProjects?.nodes
                    ?.map(p => p?.id)
                    .includes(project.id)),
        [projectStore, role])
    const assignedMembers = React.useMemo(() => memberService
            .values({namespaceId: role?.namespace?.id})
            .filter(member => member.roles?.nodes?.map(role => role?.id).includes(role?.id)),
        [memberStore, userStore, roleId])
    const canEditRole =
        role?.userAbilities?.deleteNamespaceRole ||
        role?.userAbilities?.updateNamespaceRole ||
        role?.userAbilities?.assignRoleAbilities ||
        role?.userAbilities?.assignRoleProjects

    return (
        <Flex align="center" style={{gap: "1.3rem"}} justify="space-between">
            <Flex align="center" style={{gap: "1.3rem"}}>
                <Text size="lg" hierarchy="primary" display="block">
                    {role?.name}
                </Text>
                <DNamespaceRolePermissions abilities={role?.abilities as string[] | undefined}/>
            </Flex>

            <Flex align="center" style={{gap: "1.3rem"}}>
                <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                    <Text size="xs" hierarchy="tertiary">
                        Usage
                    </Text>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge style={{verticalAlign: "middle"}}>
                                    <IconFolders size={16}/>
                                    <Text hierarchy={"tertiary"} size={"xs"}>{assignedProjects.length}</Text>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipPortal>
                                <TooltipContent side={"bottom"} maw={"200px"}>
                                    <Text>Assigned projects</Text>
                                    <TooltipArrow/>
                                    {assignedProjects.length > 0 ? (
                                        <>
                                            <Spacing spacing={"xxs"}/>
                                            <Card paddingSize={"xs"} mb={-0.3} mx={-0.65}>
                                                {assignedProjects.slice(0, 1).map(project => (
                                                    <CardSection key={project.id} border>
                                                        <Flex align={"center"} style={{gap: "0.7rem"}}>
                                                            <Avatar bg={"transparent"}
                                                                    identifier={project?.name ?? ""}/>
                                                            <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                                                                <Text size={"xs"} hierarchy={"secondary"}>
                                                                    {project?.name}
                                                                </Text>
                                                                <Text size={"xs"} hierarchy={"tertiary"}>
                                                                    {project?.description}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </CardSection>
                                                ))}
                                                {assignedProjects.slice(1, assignedProjects.length).length > 0 ? (
                                                    <CardSection border display={"flex"} p={0.35} justify={"center"} active hover>
                                                        <Button p={"0"} variant={"none"}>
                                                            <Text size={"xs"}>View more</Text>
                                                            <Badge>{assignedProjects.slice(1, assignedProjects.length).length}</Badge>
                                                        </Button>
                                                    </CardSection>
                                                ) : null}
                                            </Card>
                                        </>
                                    ) : null}
                                </TooltipContent>
                            </TooltipPortal>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge style={{verticalAlign: "middle"}}>
                                    <IconUsers size={16}/>
                                    <Text hierarchy={"tertiary"} size={"xs"}>{assignedMembers.length}</Text>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipPortal>
                                <TooltipContent side={"bottom"} maw={"200px"}>
                                    <Text>Assigned members</Text>
                                    <TooltipArrow/>
                                    {assignedMembers.length > 0 ? (
                                        <>
                                            <Spacing spacing={"xxs"}/>
                                            <Card paddingSize={"xs"} mb={-0.3} mx={-0.65}>
                                                {assignedMembers.slice(0, 1).map(member => {
                                                    const user = userService.getById(member.user?.id)
                                                    return <CardSection key={member.id} border>
                                                        <Flex align={"center"} style={{gap: "0.7rem"}}>
                                                            <Avatar bg={"transparent"}
                                                                    identifier={user?.username ?? ""}/>
                                                            <Flex style={{flexDirection: "column", gap: "0.35rem"}}>
                                                                <Text size={"xs"} hierarchy={"secondary"}>
                                                                    @{user?.username}
                                                                </Text>
                                                                <Text size={"xs"} hierarchy={"tertiary"}>
                                                                    {user?.email}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </CardSection>
                                                })}
                                                {assignedMembers.slice(1, assignedMembers.length).length > 0 ? (
                                                    <CardSection border display={"flex"} p={0.35} justify={"center"} active hover>
                                                        <Button p={"0"} variant={"none"}>
                                                            <Text size={"xs"}>View more</Text>
                                                            <Badge>{(role?.assignedProjects?.count ?? assignedMembers.length) - 1}</Badge>
                                                        </Button>
                                                    </CardSection>
                                                ) : null}
                                            </Card>
                                        </>
                                    ) : null}
                                </TooltipContent>
                            </TooltipPortal>
                        </Tooltip>
                    </Flex>
                </Flex>
                {canEditRole && (
                    <Button
                        color="secondary"
                        onClick={event => {
                            event.stopPropagation()
                            onSetting(role as DNamespaceRoleView)
                        }}
                    >
                        <IconSettings size={16}/>
                    </Button>
                )}
            </Flex>
        </Flex>
    )
}