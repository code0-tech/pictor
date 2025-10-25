import {Meta, StoryObj} from "@storybook/react"
import DNamespaceProjectMenu from "./DNamespaceProjectMenu"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput
} from "@code0-tech/sagittarius-graphql-types"
import {DNamespaceProjectView} from "./DNamespaceProject.view"
import {ContextStoreProvider} from "../../../utils/contextStore"
import React from "react"
import {useReactiveArrayService} from "../../../utils/reactiveArrayService"

const meta: Meta = {
    title: "DNamespaceProjectMenu",
    component: DNamespaceProjectMenu
}

export default meta

type DNamespaceProjectMenuStory = StoryObj<typeof DNamespaceProjectMenu>;

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

export const DProjectMenuExample: DNamespaceProjectMenuStory = {
    render: (props) => {

        const [projectStore, projectService] = useReactiveArrayService<DNamespaceProjectView, DNamespaceProjectReactiveServiceExtended>(DNamespaceProjectReactiveServiceExtended, [
        {
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
        },
        {
            id: "gid://sagittarius/NamespaceProject/2",
            name: "Another Project",
            description: "This is another project description.",
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
                    return (
                        <DNamespaceProjectMenu
                            projectId={"gid://sagittarius/NamespaceProject/1"}
                            onProjectSelect={props.onProjectSelect}
                        />
                    )
                }, [])}
            </ContextStoreProvider>
        )
    }
}