import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {
    NamespacesRolesAssignAbilitiesInput,
    NamespacesRolesAssignProjectsInput,
    NamespacesRolesCreateInput,
    NamespacesRolesDeleteInput,
    NamespacesRolesUpdateInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DNamespaceRoleService extends ReactiveArrayService<DNamespaceRoleView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    constructor(payload: ReactiveArrayStore<DNamespaceRoleView>) {
        super(payload);

    }

    abstract findById(id: Scalars['NamespaceRoleID']['output']): DNamespaceRoleView | undefined

    abstract roleAssignAbilities(payload: NamespacesRolesAssignAbilitiesInput): DNamespaceRoleView | undefined

    abstract roleAssignProjects(payload: NamespacesRolesAssignProjectsInput): DNamespaceRoleView | undefined

    abstract roleCreate(payload: NamespacesRolesCreateInput): DNamespaceRoleView | undefined

    abstract roleDelete(payload: NamespacesRolesDeleteInput): DNamespaceRoleView | undefined

    abstract roleUpdate(payload: NamespacesRolesUpdateInput): DNamespaceRoleView | undefined
}

export abstract class DNamespaceRoleReactiveService extends DNamespaceRoleService {

    findById(id: Scalars["NamespaceRoleID"]["output"]): DNamespaceRoleView | undefined {
        return this.values().find(role => role.id === id);
    }

    abstract override roleAssignAbilities(payload: NamespacesRolesAssignAbilitiesInput): DNamespaceRoleView | undefined

    abstract override roleAssignProjects(payload: NamespacesRolesAssignProjectsInput): DNamespaceRoleView | undefined

    abstract override roleCreate(payload: NamespacesRolesCreateInput): DNamespaceRoleView | undefined

    abstract override roleDelete(payload: NamespacesRolesDeleteInput): DNamespaceRoleView | undefined

    abstract override roleUpdate(payload: NamespacesRolesUpdateInput): DNamespaceRoleView | undefined

}