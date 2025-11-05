"use client"

import React from "react"
import {Menu, MenuContent, MenuItem, MenuPortal, MenuProps, MenuTrigger} from "../menu/Menu"
import Button from "../button/Button"
import {DOrganizationView} from "./DOrganization.view"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {useService} from "../../utils/contextStore"

export interface DOrganizationMenuProps extends MenuProps {
    organizationId: Scalars["OrganizationID"]["input"]
    onOrganizationSelect: (id: Scalars["OrganizationID"]["input"]) => void
}

const DOrganizationMenu: React.FC<DOrganizationMenuProps> = props => {
    const organizationService = useService(DOrganizationReactiveService)
    const organizationStore = useService(DOrganizationReactiveService)

    const currentOrganization = organizationService.getById(props.organizationId)

    return React.useMemo(() => {
        return (
            <Menu {...props}>
                <MenuTrigger asChild>
                    <Button variant={"none"} style={{background: "transparent"}}>
                        {currentOrganization?.name}
                    </Button>
                </MenuTrigger>
                <MenuPortal>
                    <MenuContent side={"bottom"} align={"start"} sideOffset={0}>
                        {organizationService.values().map((organization) => (
                            <MenuItem
                                key={organization.id}
                                onSelect={() => props.onOrganizationSelect(organization.id!!)}
                            >
                                {organization.name}
                            </MenuItem>
                        ))}
                    </MenuContent>
                </MenuPortal>
            </Menu>
        )
    }, [organizationStore])
}

export default DOrganizationMenu