import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DNamespaceProjectCard from "./DNamespaceProjectCard"
import {ContextStoreProvider} from "../../../utils/contextStore"
import {useReactiveArrayService} from "../../../utils/reactiveArrayService"
import {DNamespaceProjectView} from "./DNamespaceProject.view"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput
} from "@code0-tech/sagittarius-graphql-types"

const meta: Meta = {
    title: "DNamespaceProjectCard",
    component: DNamespaceProjectCard
}

export default meta

type DNamespaceProjectCardStory = StoryObj<typeof DNamespaceProjectCard>;

export class DNamespaceProjectReactiveServiceExtended extends DNamespaceProjectReactiveService {
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined {
        throw new Error("Method not implemented.");
    }
    projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined {
        throw new Error("Method not implemented.");
    }
    projectsDelete(payload: NamespacesProjectsDeleteInput): void {
        throw new Error("Method not implemented.");
    }

}

export const DNamespaceProjectCardExample: DNamespaceProjectCardStory = {
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
            <ContextStoreProvider services={[[projectStore, projectService]]}>
                {React.useMemo(() => {
                    return <DNamespaceProjectCard projectId={"gid://sagittarius/NamespaceProject/1"}/>
                }, [])}
            </ContextStoreProvider>
        )
    }
}