import {Meta, StoryObj} from "@storybook/react"
import React from "react"
import DOrganizationCard from "./DOrganizationCard"
import {ContextStoreProvider} from "../../utils/contextStore"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrganizationView} from "./DOrganizationView"
import {DOrganizationReactiveService} from "./DOrganizationService"
import {
    NamespacesLicensesCreateInput, NamespacesLicensesDeleteInput,
    NamespacesProjectsAssignRuntimesInput, NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput,
    OrganizationsCreateInput, OrganizationsDeleteInput, OrganizationsUpdateInput
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
    organizationCreate(payload: OrganizationsCreateInput): DOrganizationView | undefined {
        throw new Error("Method not implemented.");
    }
    organizationDelete(payload: OrganizationsDeleteInput): void {
        throw new Error("Method not implemented.");
    }
    organizationUpdate(payload: OrganizationsUpdateInput): DOrganizationView | undefined {
        throw new Error("Method not implemented.");
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
    licenseCreate(payload: NamespacesLicensesCreateInput): DNamespaceLicenseView | undefined {
        return undefined
    }

    licenseDelete(payload: NamespacesLicensesDeleteInput): void {
    }

}

export const DOrganizationCardExample: DOrganizationCardStory = {
    render: (props) => {

        const [organizationStore, organizationService] = useReactiveArrayService<DOrganizationView, DOrganizationReactiveServiceExtended>(DOrganizationReactiveServiceExtended, [{
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
        }])

        const [namespaceStore, namespaceService] = useReactiveArrayService<DNamespaceView, DNamespaceReactiveServiceExtended>(DNamespaceReactiveServiceExtended, [{
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
        }])

        const [licenseStore, licenseService] = useReactiveArrayService<DNamespaceLicenseView, DNamespaceLicenseReactiveServiceExtended>(DNamespaceLicenseReactiveServiceExtended, [{
            id: "gid://sagittarius/NamespaceLicense/1",
            createdAt: undefined,
            endDate: undefined,
            licensee: undefined,
            namespace: undefined,
            startDate: undefined,
            updatedAt: undefined
        }])

        return (
            <ContextStoreProvider services={[[organizationStore, organizationService], [namespaceStore, namespaceService], [licenseStore, licenseService]]}>
                {React.useMemo(() => {
                    return <DOrganizationCard organizationId={"gid://sagittarius/Organization/1"}/>
                }, [])}
            </ContextStoreProvider>
        )
    }
}