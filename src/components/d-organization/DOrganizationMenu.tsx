"use client"

import {Code0Component} from "../../utils/types"
import React from "react"
import {Menu, MenuContent, MenuItem, MenuPortal, MenuTrigger} from "../menu/Menu"
import Button from "../button/Button"
import {DOrganizationView} from "./DOrganizationView"
import {DOrganizationReactiveService} from "./DOrganizationService"
import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {useService} from "../../utils/contextStore"

export interface DOrganizationMenuProps extends Code0Component<HTMLDivElement> {
    organizationId: Scalars["OrganizationID"]["input"]
    onOrganizationSelect: (payload: DOrganizationView) => void
}

const DOrganizationMenu: React.FC<DOrganizationMenuProps> = props => {
    const organizationService = useService(DOrganizationReactiveService)
    const organizationStore = useService(DOrganizationReactiveService)

    const currentOrganization = organizationService.findById(props.organizationId)

    return React.useMemo(() => {
        return (
            <Menu>
                <MenuTrigger asChild>
                    <Button variant={"none"} style={{background: "transparent"}}>
                        {currentOrganization?.name}
                    </Button>
                </MenuTrigger>
                <MenuPortal >
                    <MenuContent side={"bottom"} align={"start"} sideOffset={0}>
                        {organizationService.values().map((organization) => (
                            <MenuItem
                                key={organization.id}
                                onSelect={() => props.onOrganizationSelect(organization)}
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