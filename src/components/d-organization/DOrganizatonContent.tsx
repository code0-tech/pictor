"use client"

import React from "react"
import {Code0Component, useService, useStore} from "../../utils"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Text} from "../text/Text"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {IconFolder, IconLogout, IconServer, IconSettings, IconUser} from "@tabler/icons-react"
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import {DNamespaceReactiveService} from "../d-namespace"
import {Spacing} from "../spacing/Spacing";
import {Avatar} from "../avatar/Avatar";
import {DUserReactiveService, useUserSession} from "../d-user";
import {Badge} from "../badge/Badge";

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output'] | undefined | null
}

//TODO: handle skeleton
export const DOrganizationContent: React.FC<DOrganizationCardProps> = props => {

    const {organizationId} = props
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizationService = useService(DOrganizationReactiveService)
    const namespaceStore = useStore(DNamespaceReactiveService)
    const namespaceService = useService(DNamespaceReactiveService)
    const userService = useService(DUserReactiveService)
    const userStore = useStore(DUserReactiveService)
    const currentSession = useUserSession()

    const currentUser = React.useMemo(() => userService.getById(currentSession?.user?.id), [userStore, currentSession])
    if (!currentUser) return <></>

    if (!organizationId) return <></>
    const organization = organizationService.getById(organizationId)
    if (!organization) return <></>

    const namespace = namespaceService.getById(organization.namespace?.id)
    if (!namespace) return <></>

    const projectCount = namespace.projects?.count
    const memberCount = namespace.members?.count
    const runtimeCount = namespace.runtimes?.count

    return React.useMemo(() => {
        return (
            <Flex align={"center"} style={{gap: "1.3rem"}} justify={"space-between"}>
                <Flex align={"center"} style={{gap: "1.3rem"}}>
                    <Avatar bg={"transparent"} identifier={organization?.name ?? ""}/>
                    <Flex style={{flexDirection: "column"}}>
                        <Text size={"lg"} hierarchy={"primary"} display={"block"}>
                            {organization?.name}
                        </Text>
                        <Spacing spacing={"xxs"}/>
                        <Flex align={"center"} style={{gap: "0.35rem", flexWrap: "wrap"}}>
                            <Badge color={"secondary"}>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <IconFolder size={16}/>
                                    <Text size={"xs"}
                                          hierarchy={"tertiary"}>{`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                                </Flex>
                            </Badge>
                            <Badge color={"secondary"}>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <IconUser size={16}/>
                                    <Text size={"xs"}
                                          hierarchy={"tertiary"}> {`${memberCount ?? 0} member${(memberCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                                </Flex>
                            </Badge>
                            <Badge color={"secondary"}>
                                <Flex align={"center"} style={{gap: "0.35rem"}}>
                                    <IconServer size={16}/>
                                    <Text size={"xs"}
                                          hierarchy={"tertiary"}>{`${runtimeCount ?? 0} runtime${(runtimeCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                                </Flex>
                            </Badge>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex align={"center"} style={{gap: "0.35rem"}}>
                    <Button color={"secondary"}>
                        {/**TODO: check if current user is admin or has the permissions for settings**/}
                        <IconSettings size={16}/>
                    </Button>
                    {/**TODO: check if current user is namespace member**/}
                    <Button color={"error"}>
                        <IconLogout size={16}/> Leave
                    </Button>
                </Flex>
            </Flex>
        )
    }, [organizationStore, namespaceStore])
}