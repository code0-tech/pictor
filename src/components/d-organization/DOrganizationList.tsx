"use client"

import React from "react";
import {Card} from "../card/Card";
import {useService, useStore} from "../../utils";
import {DOrganizationReactiveService} from "./DOrganization.service";
import CardSection from "../card/CardSection";
import {DOrganizationContent} from "./DOrganizatonContent";
import {DOrganizationView} from "./DOrganization.view";

export interface DOrganizationListProps extends Omit<Card, "children"> {
    filter?: (organizations: DOrganizationView, index: number) => boolean
}

export const DOrganizationList: React.FC<DOrganizationListProps> = (props) => {

    const organizationService = useService(DOrganizationReactiveService)
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizations = React.useMemo(() => organizationService.values(), [organizationStore])
    const {filter = () => true, ...rest} = props

    return <Card {...rest}>
        {organizations.filter(filter).map((organization) => (
            <CardSection>
                <DOrganizationContent organizationId={organization?.id}/>
            </CardSection>
        ))}
    </Card>
}