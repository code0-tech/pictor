import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DOrganizationCard from "./DOrganizationCard"
import {ContextStoreProvider} from "../../utils/contextStore"
import {useReactiveArrayService} from "../../utils/reactiveArrayService"
import {DOrgaView} from "./DOrga.view"
import {DOrgaReactiveService} from "./DOrga.service"

const meta: Meta = {
    title: "DOrganizationCard",
    component: DOrganizationCard
}

export default meta

type DOrganizationCardStory = StoryObj<typeof DOrganizationCard>;

export const DOrganizationCardExample: DOrganizationCardStory = {
    render: (props) => {

        const [organizationStore, organizationService] = useReactiveArrayService<DOrgaView, DOrgaReactiveService>(DOrgaReactiveService, [{
            id: "gid://sagittarius/Organization/1",
            name: "Example Organization",
            namespace: {
                id: "gid://sagittarius/Namespace/1"
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