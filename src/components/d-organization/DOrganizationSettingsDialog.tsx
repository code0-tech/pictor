"use client"

import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogProps, DialogTitle} from "../dialog/Dialog"
import React, {useMemo, useState} from "react"
import {useService} from "../../utils"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {Button} from "../button/Button"
import {useForm} from "../form"
import {VisuallyHidden} from "@ariakit/react"

export interface DOrganizationSettingsDialogProps extends DialogProps {
    organizationId: Scalars["OrganizationID"]["input"]
}

type Tab = "General" | "Roles" |"Runtimes" | "Members"

const DOrganizationSettingsDialog: React.FC<DOrganizationSettingsDialogProps> = props => {
    const organizationService = useService(DOrganizationReactiveService)
    const organizationStore = useService(DOrganizationReactiveService)

    const [currentTab, setCurrentTab] = useState<Tab>("General")

    const organization = organizationService.getById(props.organizationId)

    const [scheme, validate] = useForm({
        initialValues: {
            name: organization?.name,
        },
        validate: {
            name: (value) => {
                if (!value) return "Name is required"
                return null
            },
        },
        onSubmit: (values) => {
        }
    })

    return useMemo(() => {
        return (
            <Dialog open={true} onOpenChange={props.onOpenChange}>
                <DialogContent showCloseButton>
                    <DialogHeader>
                        <VisuallyHidden>
                            <DialogTitle>
                                Title
                            </DialogTitle>
                        </VisuallyHidden>
                    </DialogHeader>

                    <Button onClick={() => setCurrentTab("General")}>
                        General
                    </Button>
                    <Button onClick={() => setCurrentTab("Roles")}>
                        Roles
                    </Button>
                    <Button onClick={() => setCurrentTab("Runtimes")}>
                        Runtimes
                    </Button>
                    <Button onClick={() => setCurrentTab("Members")}>
                        Members
                    </Button>

                    {currentTab === "General" && <GeneralTab/>}
                    {currentTab === "Roles" && <RolesTab/>}
                    {currentTab === "Runtimes" && <RuntimesTab/>}
                    {currentTab === "Members" && <MembersTab/>}


                </DialogContent>
            </Dialog>
        )
    }, [organizationStore])
}

const GeneralTab = () => {
    return (
        <div>

        </div>
    )
}

const RolesTab = () => {
    return (
        <div>

        </div>
    )
}

const RuntimesTab = () => {
    return (
        <div>

        </div>
    )
}

const MembersTab = () => {
    return (
        <div>

        </div>
    )
}

export default DOrganizationSettingsDialog