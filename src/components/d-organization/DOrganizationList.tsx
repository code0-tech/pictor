"use client"

import React from "react";
import {Card} from "../card/Card";
import {useService, useStore} from "../../utils";
import {DOrganizationReactiveService} from "./DOrganization.service";
import CardSection from "../card/CardSection";
import {DOrganizationContent} from "./DOrganizatonContent";
import {DOrganizationView} from "./DOrganization.view";
import {Organization, Scalars} from "@code0-tech/sagittarius-graphql-types";

export interface DOrganizationListProps extends Omit<Card, "children" | "onSelect"> {
    filter?: (organizations: DOrganizationView, index: number) => boolean
    onSetting?: (organizationId: Organization['id']) => void
    onLeave?: (organizationId: Organization['id']) => void
    onSelect?: (organizationId: Organization['id']) => void
}

export const DOrganizationList: React.FC<DOrganizationListProps> = (props) => {

    const organizationService = useService(DOrganizationReactiveService)
    const organizationStore = useStore(DOrganizationReactiveService)
    const organizations = React.useMemo(() => organizationService.values(), [organizationStore])
    const {filter = () => true, onLeave, onSetting, onSelect, ...rest} = props

    return <Card {...rest}>
        {organizations.filter(filter).map((organization) => organization.id && (
            <CardSection border hover onClick={() => {
                if (onSelect) onSelect(organization.id)
            }} key={organization.id}>
                <DOrganizationContent onLeave={onLeave} onSetting={onSetting} organizationId={organization?.id}/>
            </CardSection>
        ))}
    </Card>
}