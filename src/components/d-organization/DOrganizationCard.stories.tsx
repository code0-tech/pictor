import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DOrganizationCard, {DOrganizationReactiveServiceExtended} from "./DOrganizationCard"
import {ContextStoreProvider} from "../../utils/contextStore"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrganizationView} from "./DOrganizationView"

const meta: Meta = {
    title: "DOrganizationCard",
    component: DOrganizationCard
}

export default meta

type DOrganizationCardStory = StoryObj<typeof DOrganizationCard>;

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