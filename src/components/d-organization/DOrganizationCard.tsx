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
import {Spacing} from "../spacing/Spacing";

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
            <Card>
                <Flex align={"center"} style={{gap: "0.7rem"}} justify={"space-between"}>
                    <Flex style={{flexDirection: "column"}}>
                        <Text size={"lg"} hierarchy={"primary"} display={"block"}>
                            {organization?.name}
                        </Text>
                        <Spacing spacing={"md"}/>
                        <Flex align={"center"} style={{gap: "1.3rem", flexWrap: "wrap"}}>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconFolder size={18}/>
                                <Text size={"xs"} hierarchy={"tertiary"}>{`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                            </Flex>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconUser size={18}/>
                                <Text size={"xs"} hierarchy={"tertiary"}> {`${memberCount ?? 0} member${(memberCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                            </Flex>
                            <Flex align={"center"} style={{gap: "0.35rem"}}>
                                <IconServer size={18}/>
                                <Text size={"xs"} hierarchy={"tertiary"}>{`${runtimeCount ?? 0} runtime${(runtimeCount ?? 0) !== 1 ? "s" : ""}`}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        <Button color={"secondary"} onClick={() => onSettingsClick(organizationId)}><IconSettings size={16}/></Button>
                        <Button color={"error"} onClick={() => onLeaveClick(organizationId)}><IconLogout size={16}/> Leave</Button>
                    </Flex>
                </Flex>
            </Card>
        )
    }, [organizationStore, namespaceStore, licenseStore])
}

export default DOrganizationCard