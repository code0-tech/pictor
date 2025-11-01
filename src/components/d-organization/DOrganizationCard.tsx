"use client"

import React from "react"
import {Code0Component} from "../../utils/types"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../../index"
import Text from "../text/Text"
import {useService, useStore} from "../../utils/contextStore"
import {DOrganizationReactiveService} from "./DOrganizationService"
import {
    IconAward,
    IconFolder,
    IconLicense,
    IconLogout,
    IconServer,
    IconSettings,
    IconSitemap,
    IconUser
} from "@tabler/icons-react"
import Badge from "../badge/Badge"
import Flex from "../flex/Flex";
import Button from "../button/Button";
import CardSection from "../card/CardSection";

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizationService = useService(DOrganizationReactiveService)

    const organization = organizationService.findById(props.organizationId)
    const projectCount = organization?.namespace?.projects?.count

    return React.useMemo(() => {
        return (
            <Card maw={"400px"}>
                <Flex align={"center"} style={{gap: "0.7rem"}} justify={"space-between"}>
                    <Text size={"lg"} hierarchy={"primary"} display={"block"}>
                        {organization?.name}
                    </Text>
                    <Flex align={"center"} style={{gap: "0.35rem"}}>
                        <Button color={"secondary"}><IconSettings size={16}/></Button>
                        <Button color={"error"}><IconLogout size={16}/> Leave</Button>
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
                            {`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}
                        </Badge>
                        {/* Members count */}
                        <Badge color={"info"}>
                            <IconUser size={18}/>
                            {`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}
                        </Badge>
                        {/* Which License (CE / EE) */}
                        <Badge color={"info"}>
                            <IconAward size={18}/>
                            {`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}
                        </Badge>
                        {/* Runtime Count */}
                        <Badge color={"info"}>
                            <IconServer size={18}/>
                            {`${projectCount ?? 0} project${(projectCount ?? 0) !== 1 ? "s" : ""}`}
                        </Badge>
                    </Flex>

                </CardSection>
            </Card>
        )
    }, [organizationStore])
}

export default DOrganizationCard