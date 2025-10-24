import {Meta, StoryObj} from "@storybook/react"
import React from "react"
import DOrganizationCard from "./DOrganizationCard"
import {ContextStoreProvider} from "../../utils/contextStore"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrganizationView} from "./DOrganizationView"
import {DOrganizationReactiveService} from "./DOrganizationService"
import { OrganizationsCreateInput, OrganizationsDeleteInput, OrganizationsUpdateInput } from "@code0-tech/sagittarius-graphql-types"

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

        return (
            <ContextStoreProvider services={[[organizationStore, organizationService]]}>
                {React.useMemo(() => {
                    return <DOrganizationCard organizationId={"gid://sagittarius/Organization/1"}/>
                }, [])}
            </ContextStoreProvider>
        )
    }
}