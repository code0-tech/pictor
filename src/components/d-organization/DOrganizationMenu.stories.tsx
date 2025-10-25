import {Meta, StoryObj} from "@storybook/react";
import {ContextStoreProvider} from "../../utils/contextStore"
import React from "react"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrganizationReactiveService} from "./DOrganizationService"
import {
    OrganizationsCreateInput,
    OrganizationsDeleteInput,
    OrganizationsUpdateInput
} from "@code0-tech/sagittarius-graphql-types"
import {DOrganizationView} from "./DOrganizationView"
import DOrganizationMenu from "./DOrganizationMenu"

const meta: Meta = {
    title: "DOrganizationMenu",
    component: DOrganizationMenu
}

export default meta

type DOrganizationMenuStory = StoryObj<typeof DOrganizationMenu>;

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

export const DOrganizationMenuExample: DOrganizationMenuStory = {
    render: (props) => {

        const [organizationStore, organizationService] = useReactiveArrayService<DOrganizationView, DOrganizationReactiveServiceExtended>(DOrganizationReactiveServiceExtended, [
            {
                id: "gid://sagittarius/Organization/1",
                name: "Example Organization",
                namespace: {
                    id: "gid://sagittarius/Namespace/1"
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            },
            {
                id: "gid://sagittarius/Organization/2",
                name: "Another Organization",
                namespace: {
                    id: "gid://sagittarius/Namespace/1"
                },
                createdAt: new Date().toString(),
                updatedAt: new Date().toString()
            }])

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