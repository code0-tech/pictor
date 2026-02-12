import {
    Namespace,
    NamespaceProject,
    NamespacesProjectsAssignRuntimesInput, NamespacesProjectsAssignRuntimesPayload,
    NamespacesProjectsCreateInput, NamespacesProjectsCreatePayload,
    NamespacesProjectsDeleteInput, NamespacesProjectsDeletePayload, NamespacesProjectsUpdateInput,
    NamespacesProjectsUpdatePayload
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {ReactiveArrayService} from "../../utils";

export type DProjectDependencies = {
    namespaceId: Namespace['id']
}

export abstract class DNamespaceProjectReactiveService extends ReactiveArrayService<DNamespaceProjectView, DProjectDependencies> {

    getById(id: NamespaceProject['id'], dependencies?: DProjectDependencies): DNamespaceProjectView | undefined {
        return this.values(dependencies).find(project => project && project.id === id)
    }

    abstract projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): Promise<NamespacesProjectsAssignRuntimesPayload | undefined>

    abstract projectUpdate(payload: NamespacesProjectsUpdateInput): Promise<NamespacesProjectsUpdatePayload | undefined>

    abstract projectCreate(payload: NamespacesProjectsCreateInput): Promise<NamespacesProjectsCreatePayload | undefined>

    abstract projectDelete(payload: NamespacesProjectsDeleteInput): Promise<NamespacesProjectsDeletePayload | undefined>
}