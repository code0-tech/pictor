"use client"

import React from "react"
import {Code0Component} from "../../utils/types"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../card/Card"
import {Text} from "../text/Text"
import {useService, useStore} from "../../utils/contextStore"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {IconFolder, IconLogout, IconServer, IconSettings, IconUser} from "@tabler/icons-react"
import {Badge} from "../badge/Badge"
import {Flex} from "../flex/Flex";
import {Button} from "../button/Button";
import CardSection from "../card/CardSection";
import {DNamespaceReactiveService} from "../d-namespace/DNamespace.service"
import {DNamespaceLicenseReactiveService} from "../d-namespace/license/DNamespaceLicense.service"

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
    onSettingsClick?: (organizationId: Scalars['OrganizationID']['output']) => void
    onLeaveClick?: (organizationId: Scalars['OrganizationID']['output']) => void
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const {organizationId, onSettingsClick = () => {}, onLeaveClick = () => {}} = props
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizationService = useService(DOrganizationReactiveService)

    const namespaceStore = useStore(DNamespaceReactiveService)
    const namespaceService = useService(DNamespaceReactiveService)

    const licenseStore = useStore(DNamespaceLicenseReactiveService)
    const licenseService = useService(DNamespaceLicenseReactiveService)

    const organization = organizationService.getById(organizationId)
    if (!organization?.namespace?.id) return

    const namespace = namespaceService.getById(organization?.namespace?.id)

    const projectCount = organization?.namespace?.projects?.count
    const memberCount = namespace?.members?.count
    const runtimeCount = namespace?.runtimes?.count

    return React.useMemo(() => {
        return (
            <Card maw={"400px"}>
                <Flex align={"center"} style={{gap: "0.7rem"}} justify={"space-between"}>
                    <Text size={"lg"} hierarchy={"primary"} display={"block"}>
                        {organization?.name}
                    </Text>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        <Button color={"secondary"} onClick={() => onSettingsClick(organizationId)}><IconSettings size={16}/></Button>
                        <Button color={"error"} onClick={() => onLeaveClick(organizationId)}><IconLogout size={16}/> Leave</Button>
                    </Flex>
                </Flex>
                <Text size={"sm"} hierarchy={"tertiary"} display={"block"}>
                    {organization?.name}
                </Text>
                <CardSection border>
                    <Flex align={"center"} style={{gap: "0.35rem", flexWrap: "wrap"}}>
                        {/* Project count */}
                        <Badge color={"info"}>
                            <IconFolder size={18}/>
                            <Text size={"xs"}>{`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                        </Badge>
                        {/* Members count */}
                        <Badge color={"info"}>
                            <IconUser size={18}/>
                            <Text size={"xs"}>{`${memberCount ?? 0} member${(memberCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                        </Badge>
                        {/* Which License (CE / EE) */}
                        {/*
                        <Badge color={"info"}>
                            <IconAward size={18}/>
                            <Text size={"xs"}>{`${licenseName} license`}</Text>
                        </Badge>
                        */}
                        {/* Runtime Count */}
                        <Badge color={"info"}>
                            <IconServer size={18}/>
                            <Text size={"xs"}>{`${runtimeCount ?? 0} runtime${(runtimeCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                        </Badge>
                    </Flex>
                </CardSection>
            </Card>
        )
    }, [organizationStore, namespaceStore, licenseStore])
}

export default DOrganizationCard