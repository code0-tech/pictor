import {Meta, StoryObj} from "@storybook/react"
import DNamespaceProjectMenu from "./DNamespaceProjectMenu"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsAssignRuntimesPayload,
    NamespacesProjectsCreateInput,
    NamespacesProjectsCreatePayload,
    NamespacesProjectsDeleteInput,
    NamespacesProjectsDeletePayload
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
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): Promise<NamespacesProjectsAssignRuntimesPayload | undefined> {
        return Promise.resolve(undefined);
    }

    projectCreate(payload: NamespacesProjectsCreateInput): Promise<NamespacesProjectsCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    projectDelete(payload: NamespacesProjectsDeleteInput): Promise<NamespacesProjectsDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }
}

export const DProjectMenuExample: DNamespaceProjectMenuStory = {
    render: (props) => {

        const [projectStore, projectService] = useReactiveArrayService<DNamespaceProjectView, DNamespaceProjectReactiveServiceExtended>(DNamespaceProjectReactiveServiceExtended, [
            new DNamespaceProjectView({
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
            }),
            new DNamespaceProjectView({
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
            })
        ])

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