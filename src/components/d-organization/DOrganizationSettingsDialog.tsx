"use client"

import {Scalars} from "@code0-tech/sagittarius-graphql-types"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogProps, DialogTitle} from "../dialog/Dialog"
import React, {useMemo, useState} from "react"
import {useService, useStore} from "../../utils"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {Button} from "../button/Button"
import {useForm} from "../form"
import {VisuallyHidden} from "@ariakit/react"
import {
    DNamespaceMemberReactiveService, DNamespaceMemberView,
    DNamespaceReactiveService,
    DNamespaceRoleReactiveService,
    DNamespaceRoleView, DNamespaceView
} from "../d-namespace"
import {DRuntimeReactiveService, DRuntimeView} from "../d-runtime"
import {DOrganizationView} from "./DOrganization.view"
import {DLayout} from "../d-layout/DLayout"
import {Col} from "../col/Col"

export interface DOrganizationSettingsDialogProps extends DialogProps {
    organizationId: Scalars["OrganizationID"]["input"]
}

type Tab = "General" | "Roles" |"Runtimes" | "Members"

interface GeneralTabProps {
    organizationService: DOrganizationReactiveService
    organization: DOrganizationView
    namespace: DNamespaceView
}

interface RolesTabProps {
    roleService: DOrganizationReactiveService
    roles: (DNamespaceRoleView | undefined)[]
}

interface RuntimesTabProps {
    runtimeService: DRuntimeReactiveService
    runtimes: (DRuntimeView | undefined)[]
}

interface MembersTabProps {
    memberService: DNamespaceMemberReactiveService
    members: (DNamespaceMemberView | undefined)[]
}

const DOrganizationSettingsDialog: React.FC<DOrganizationSettingsDialogProps> = props => {
    const organizationService = useService(DOrganizationReactiveService)
    const organizationStore = useStore(DOrganizationReactiveService)

    const namespaceService = useService(DNamespaceReactiveService)
    const namespaceStore = useStore(DNamespaceReactiveService)

    const roleService = useService(DNamespaceRoleReactiveService)
    const roleStore = useStore(DNamespaceRoleReactiveService)

    const runtimeService = useService(DRuntimeReactiveService)
    const runtimeStore = useStore(DRuntimeReactiveService)

    const memberService = useService(DNamespaceMemberReactiveService)
    const memberStore = useStore(DNamespaceMemberReactiveService)

    const [currentTab, setCurrentTab] = useState<Tab>("General")

    const organization = organizationService.getById(props.organizationId)
    const namespace = namespaceService.getById(organization?.namespace?.id)
    if (!organization || !namespace) return

    const roles = namespace.roles?.nodes?.map(n => roleService.getById(n?.id)) ?? []
    const runtimes = namespace.runtimes?.nodes?.map(r => runtimeService.getById(r?.id)) ?? []
    const members = namespace.members?.nodes?.map(m => memberService.getById(m?.id)) ?? []

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

                    <DLayout
                        leftContent={
                            <Col>
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
                            </Col>
                        }
                        rightContent={
                            <>
                                {currentTab === "General" && <GeneralTab organizationService={organizationService} organization={organization} namespace={namespace}/>}
                                {currentTab === "Roles" && <RolesTab roleService={roleService} roles={roles}/>}
                                {currentTab === "Runtimes" && <RuntimesTab runtimeService={runtimeService} runtimes={runtimes}/>}
                                {currentTab === "Members" && <MembersTab memberService={memberService} members={members}/>}
                            </>
                        }
                    >
                        <div/>
                    </DLayout>
                </DialogContent>
            </Dialog>
        )
    }, [organizationStore, namespaceStore, roleStore, runtimeStore, memberStore])
}

const GeneralTab: React.FC<GeneralTabProps> = ({organizationService, organization, namespace}) => {
    return (
        <div>

        </div>
    )
}

const RolesTab: React.FC<RolesTabProps> = ({roleService, roles}) => {
    return (
        <div>

        </div>
    )
}

const RuntimesTab: React.FC<RuntimesTabProps> = ({runtimeService, runtimes}) => {
    return (
        <div>

        </div>
    )
}

const MembersTab: React.FC<MembersTabProps> = ({memberService, members}) => {
    return (
        <div>

        </div>
    )
}

export default DOrganizationSettingsDialog