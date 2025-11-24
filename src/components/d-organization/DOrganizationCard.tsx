"use client"

import React from "react"
import {Code0Component} from "../../utils"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Card} from "../card/Card"
import {DOrganizationContent} from "./DOrganizatonContent";
import {DOrganizationView} from "./DOrganization.view";

export interface DOrganizationCardProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars['OrganizationID']['output']
    onSetting?: (organization: DOrganizationView) => void
    onLeave?: (organization: DOrganizationView) => void
}

const DOrganizationCard: React.FC<DOrganizationCardProps> = props => {
    const {organizationId, onLeave, onSetting} = props

    return <Card>
        <DOrganizationContent onLeave={onLeave} onSetting={onSetting} organizationId={organizationId}/>
    </Card>

}

export default DOrganizationCard