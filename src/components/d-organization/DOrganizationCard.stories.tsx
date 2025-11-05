import {Meta, StoryObj} from "@storybook/react"
import React from "react"
import DOrganizationCard from "./DOrganizationCard"
import {ContextStoreProvider} from "../../utils/contextStore"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrganizationView} from "./DOrganization.view"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {
    NamespacesLicensesCreateInput, NamespacesLicensesCreatePayload,
    NamespacesLicensesDeleteInput, NamespacesLicensesDeletePayload,
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput,
    NamespacesProjectsDeleteInput,
    OrganizationsCreateInput,
    OrganizationsCreatePayload,
    OrganizationsDeleteInput, OrganizationsDeletePayload,
    OrganizationsUpdateInput,
    OrganizationsUpdatePayload
} from "@code0-tech/sagittarius-graphql-types"
import {DNamespaceProjectReactiveService} from "../d-namespace/project/DNamespaceProject.service"
import {DNamespaceProjectView} from "../d-namespace/project/DNamespaceProject.view"
import {DNamespaceLicenseReactiveService} from "../d-namespace/license/DNamespaceLicense.service"
import {DNamespaceLicenseView} from "../d-namespace/license/DNamespaceLicense.view"
import {DNamespaceView} from "../d-namespace/DNamespace.view"
import {DNamespaceReactiveService} from "../d-namespace/DNamespace.service"

const meta: Meta = {
    title: "DOrganizationCard",
    component: DOrganizationCard
}

export default meta

type DOrganizationCardStory = StoryObj<typeof DOrganizationCard>;

class DOrganizationReactiveServiceExtended extends DOrganizationReactiveService {
    organizationCreate(payload: OrganizationsCreateInput): Promise<OrganizationsCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    organizationDelete(payload: OrganizationsDeleteInput): Promise<OrganizationsDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }

    organizationUpdate(payload: OrganizationsUpdateInput): Promise<OrganizationsUpdatePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

class DNamespaceReactiveServiceExtended extends DNamespaceReactiveService {
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined {
        return undefined
    }

    projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined {
        return undefined
    }

    projectsDelete(payload: NamespacesProjectsDeleteInput): void {
    }
}

class DNamespaceLicenseReactiveServiceExtended extends DNamespaceLicenseReactiveService {
    licenseCreate(payload: NamespacesLicensesCreateInput): Promise<NamespacesLicensesCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    licenseDelete(payload: NamespacesLicensesDeleteInput): Promise<NamespacesLicensesDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export const DOrganizationCardExample: DOrganizationCardStory = {
    render: (props) => {

        const [organizationStore, organizationService] = useReactiveArrayService<DOrganizationView, DOrganizationReactiveServiceExtended>(DOrganizationReactiveServiceExtended, [
            new DOrganizationView({
                id: "gid://sagittarius/Organization/1",
                name: "Example Organization",
                namespace: {
                    id: "gid://sagittarius/Namespace/1",
                    projects: {
                        count: 5
                    }
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            })
        ])

        const [namespaceStore, namespaceService] = useReactiveArrayService<DNamespaceView, DNamespaceReactiveServiceExtended>(DNamespaceReactiveServiceExtended, [
            new DNamespaceView({
                id: "gid://sagittarius/Namespace/1",
                members: {
                    count: 12
                },
                runtimes: {
                    count: 3
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
                namespaceLicenses: {
                    count: 1,
                    nodes: [{
                        id: "gid://sagittarius/NamespaceLicense/1",
                    }]
                },
                parent: undefined,
                projects: undefined,
                roles: undefined
            })
        ])

        const [licenseStore, licenseService] = useReactiveArrayService<DNamespaceLicenseView, DNamespaceLicenseReactiveServiceExtended>(DNamespaceLicenseReactiveServiceExtended, [
            new DNamespaceLicenseView({
                id: "gid://sagittarius/NamespaceLicense/1",
                createdAt: undefined,
                endDate: undefined,
                licensee: undefined,
                namespace: undefined,
                startDate: undefined,
                updatedAt: undefined
            })
        ])

        return (
            <ContextStoreProvider services={[[organizationStore, organizationService], [namespaceStore, namespaceService], [licenseStore, licenseService]]}>
                {React.useMemo(() => {
                    return <DOrganizationCard organizationId={"gid://sagittarius/Organization/1"}/>
                }, [])}
            </ContextStoreProvider>
        )
    }
}