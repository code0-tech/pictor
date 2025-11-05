import {Meta, StoryObj} from "@storybook/react";
import {ContextStoreProvider} from "../../utils/contextStore"
import React from "react"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrganizationReactiveService} from "./DOrganization.service"
import {
    OrganizationsCreateInput, OrganizationsCreatePayload,
    OrganizationsDeleteInput, OrganizationsDeletePayload,
    OrganizationsUpdateInput, OrganizationsUpdatePayload
} from "@code0-tech/sagittarius-graphql-types"
import {DOrganizationView} from "./DOrganization.view"
import DOrganizationMenu from "./DOrganizationMenu"

const meta: Meta = {
    title: "DOrganizationMenu",
    component: DOrganizationMenu
}

export default meta

type DOrganizationMenuStory = StoryObj<typeof DOrganizationMenu>;

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

export const DOrganizationMenuExample: DOrganizationMenuStory = {
    render: (props) => {

        const [organizationStore, organizationService] = useReactiveArrayService<DOrganizationView, DOrganizationReactiveServiceExtended>(DOrganizationReactiveServiceExtended, [
            new DOrganizationView({
                id: "gid://sagittarius/Organization/1",
                name: "Example Organization",
                namespace: {
                    id: "gid://sagittarius/Namespace/1"
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            }),
            new DOrganizationView({
                id: "gid://sagittarius/Organization/2",
                name: "Another Organization",
                namespace: {
                    id: "gid://sagittarius/Namespace/1"
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            })
        ])

        return (
            <ContextStoreProvider services={[[organizationStore, organizationService]]}>
                {React.useMemo(() => {
                    return (
                        <DOrganizationMenu
                            organizationId={"gid://sagittarius/Organization/1"}
                            onOrganizationSelect={props.onOrganizationSelect}
                        />
                    )
                }, [])}
            </ContextStoreProvider>
        )
    }
}