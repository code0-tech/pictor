import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput, NamespacesProjectsDeleteInput, Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export interface DNamespaceProjectService {
    projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined
    projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined
    projectsDelete(payload: NamespacesProjectsDeleteInput): void
    findById(id: Scalars['NamespaceProjectID']['output']): DNamespaceProjectView | undefined
}

export abstract class DNamespaceProjectReactiveService extends ReactiveArrayService<DNamespaceProjectView> implements DNamespaceProjectService{

    constructor(payload: ReactiveArrayStore<DNamespaceProjectView>) {
        super(payload);
    }

    findById(id: Scalars["NamespaceProjectID"]["output"]): DNamespaceProjectView | undefined {
        return this.values().find(project => project.id === id)
    }

    abstract projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined
    abstract projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined
    abstract projectsDelete(payload: NamespacesProjectsDeleteInput): void

}