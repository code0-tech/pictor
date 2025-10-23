import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DNamespaceProjectCard, {DNamespaceProjectReactiveServiceExtended} from "./DNamespaceProjectCard"
import {ContextStoreProvider} from "../../../utils/contextStore"
import {useReactiveArrayService} from "../../../utils/reactiveArrayService"
import {DNamespaceProjectView} from "./DNamespaceProject.view"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput
} from "@code0-tech/sagittarius-graphql-types"

const meta: Meta = {
    title: "DProjectCard",
    component: DNamespaceProjectCard
}

export default meta

type DProjectCardStory = StoryObj<typeof DNamespaceProjectCard>;

export const DProjectCardExample: DProjectCardStory = {
    render: (props) => {

        const [projectStore, projectService] = useReactiveArrayService<DNamespaceProjectView, DNamespaceProjectReactiveServiceExtended>(DNamespaceProjectReactiveServiceExtended, [{
            id: "gid://sagittarius/NamespaceProject/1",
            name: "Example Project",
            description: "This is an example project description.",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            namespace: {
                id: "gid://sagittarius/Namespace/1"
            },
            flow: undefined,
            flows: undefined,
            primaryRuntime: undefined,
            runtimes: undefined
        }])

        return (
            <ContextStoreProvider
                services={[[projectStore, projectService]]}>
                {React.useMemo(() => {
                    return<DNamespaceProjectCard projectId={"gid://sagittarius/NamespaceProject/1"}/>
                }, [])}
            </ContextStoreProvider>

        )
    }
}