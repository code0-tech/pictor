import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DNamespaceProjectCard from "./DNamespaceProjectCard"
import {ContextStoreProvider} from "../../../utils/contextStore"
import {useReactiveArrayService} from "../../../utils/reactiveArrayService"
import {DNamespaceProjectView} from "./DNamespaceProject.view"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput, RuntimesCreateInput, RuntimesDeleteInput,
    RuntimesRotateTokenInput, RuntimesUpdateInput
} from "@code0-tech/sagittarius-graphql-types"
import {DNamespaceReactiveService} from "../DNamespace.service"
import {DNamespaceView} from "../DNamespace.view"
import {DRuntimeReactiveService} from "../../d-runtime/DRuntime.service"
import {DRuntimeView} from "../../d-runtime/DRuntime.view"

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

export class DNamespaceReactiveServiceExtended extends DNamespaceReactiveService {}

export class DRuntimeReactiveServiceExtended extends DRuntimeReactiveService {
    runtimeCreate(payload: RuntimesCreateInput): DRuntimeView | undefined {
        return undefined
    }

    runtimeDelete(payload: RuntimesDeleteInput): DRuntimeView | undefined {
        return undefined
    }

    runtimeRotateToken(payload: RuntimesRotateTokenInput): DRuntimeView | undefined {
        return undefined
    }

    runtimeUpdate(payload: RuntimesUpdateInput): DRuntimeView | undefined {
        return undefined
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
            flows: {
                count: 10
            },
            primaryRuntime: {
                id: "gid://sagittarius/Runtime/1"
            },
            runtimes: undefined
        }])

        const [namespaceStore, namespaceService] = useReactiveArrayService<DNamespaceView, DNamespaceReactiveServiceExtended>(DNamespaceReactiveServiceExtended, [{
            id: "gid://sagittarius/Namespace/1",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            projects: undefined,
            runtimes: {
                count: 5
            },
            members: undefined,
            namespaceLicenses: undefined,
            parent: undefined,
            roles: undefined
        }])

        const [runtimeStore, runtimeService] = useReactiveArrayService<DRuntimeView, DRuntimeReactiveServiceExtended>(DRuntimeReactiveServiceExtended, [{
            id: "gid://sagittarius/Runtime/1",
            name: "Example Runtime",
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
            token: "example-token",
            dataTypes: undefined,
            description: undefined,
            flowTypes: undefined,
            namespace: undefined,
            projects: undefined,
            status: undefined
        }])

        return (
            <ContextStoreProvider services={[[projectStore, projectService], [namespaceStore, namespaceService], [runtimeStore, runtimeService]]}>
                {React.useMemo(() => {
                    return <DNamespaceProjectCard projectId={"gid://sagittarius/NamespaceProject/1"}/>
                }, [])}
            </ContextStoreProvider>
        )
    }
}