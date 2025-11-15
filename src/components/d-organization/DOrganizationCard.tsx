"use client"

import React from "react"
import {Code0Component, useService, useStore} from "../../utils"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../card/Card"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {DOrganizationContent} from "./DOrganizatonContent";

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
    onSettingsClick?: (organizationId: Scalars['OrganizationID']['output']) => void
    onLeaveClick?: (organizationId: Scalars['OrganizationID']['output']) => void
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const {organizationId} = props
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizationService = useService(DOrganizationReactiveService)
    const organization = organizationService.getById(organizationId)

    return React.useMemo(() => {
        return <Card>
            <DOrganizationContent organizationId={organization?.id}/>
        </Card>

    }, [organizationStore])
}

export default DOrganizationCard