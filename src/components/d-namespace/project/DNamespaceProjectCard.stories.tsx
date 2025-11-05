import {Meta, StoryObj} from "@storybook/react";
import React from "react";
import DNamespaceProjectCard from "./DNamespaceProjectCard"
import {ContextStoreProvider} from "../../../utils/contextStore"
import {useReactiveArrayService} from "../../../utils/reactiveArrayService"
import {DNamespaceProjectView} from "./DNamespaceProject.view"
import {DNamespaceProjectReactiveService} from "./DNamespaceProject.service"
import {
    NamespacesProjectsAssignRuntimesInput, NamespacesProjectsAssignRuntimesPayload,
    NamespacesProjectsCreateInput, NamespacesProjectsCreatePayload,
    NamespacesProjectsDeleteInput, NamespacesProjectsDeletePayload,
    RuntimesCreateInput,
    RuntimesCreatePayload,
    RuntimesDeleteInput, RuntimesDeletePayload,
    RuntimesRotateTokenInput, RuntimesRotateTokenPayload,
    RuntimesUpdateInput, RuntimesUpdatePayload
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

export class DNamespaceReactiveServiceExtended extends DNamespaceReactiveService {}

export class DRuntimeReactiveServiceExtended extends DRuntimeReactiveService {
    runtimeCreate(payload: RuntimesCreateInput): Promise<RuntimesCreatePayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeDelete(payload: RuntimesDeleteInput): Promise<RuntimesDeletePayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeRotateToken(payload: RuntimesRotateTokenInput): Promise<RuntimesRotateTokenPayload | undefined> {
        return Promise.resolve(undefined);
    }

    runtimeUpdate(payload: RuntimesUpdateInput): Promise<RuntimesUpdatePayload | undefined> {
        return Promise.resolve(undefined);
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