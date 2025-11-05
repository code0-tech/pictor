import {
    NamespaceProject,
    NamespacesProjectsAssignRuntimesInput, NamespacesProjectsAssignRuntimesPayload,
    NamespacesProjectsCreateInput, NamespacesProjectsCreatePayload,
    NamespacesProjectsDeleteInput, NamespacesProjectsDeletePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export abstract class DNamespaceProjectReactiveService extends ReactiveArrayService<DNamespaceProjectView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it


    getById(id: NamespaceProject['id']): DNamespaceProjectView | undefined {
        return this.values().find(project => project.id === id)
    }

    abstract projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): Promise<NamespacesProjectsAssignRuntimesPayload | undefined>

    abstract projectCreate(payload: NamespacesProjectsCreateInput): Promise<NamespacesProjectsCreatePayload | undefined>

    abstract projectDelete(payload: NamespacesProjectsDeleteInput): Promise<NamespacesProjectsDeletePayload | undefined>
}