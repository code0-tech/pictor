import {
    NamespacesProjectsAssignRuntimesInput,
    NamespacesProjectsCreateInput,
    NamespacesProjectsDeleteInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceProjectView} from "./DNamespaceProject.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export abstract class DNamespaceProjectService extends ReactiveArrayService<DNamespaceProjectView> {

    constructor(payload: ReactiveArrayStore<DNamespaceProjectView>) {
        super(payload);
    }

    abstract projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined

    abstract projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined

    abstract projectsDelete(payload: NamespacesProjectsDeleteInput): void

    abstract findById(id: Scalars['NamespaceProjectID']['output']): DNamespaceProjectView | undefined
}

export abstract class DNamespaceProjectReactiveService extends DNamespaceProjectService {

    findById(id: Scalars["NamespaceProjectID"]["output"]): DNamespaceProjectView | undefined {
        return this.values().find(project => project.id === id)
    }

    abstract projectAssignRuntimes(payload: NamespacesProjectsAssignRuntimesInput): DNamespaceProjectView | undefined

    abstract projectsCreate(payload: NamespacesProjectsCreateInput): DNamespaceProjectView | undefined

    abstract projectsDelete(payload: NamespacesProjectsDeleteInput): void

}