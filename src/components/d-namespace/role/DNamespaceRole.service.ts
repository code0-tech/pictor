import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {
    NamespaceRole,
    NamespacesRolesAssignAbilitiesInput, NamespacesRolesAssignAbilitiesPayload,
    NamespacesRolesAssignProjectsInput, NamespacesRolesAssignProjectsPayload,
    NamespacesRolesCreateInput, NamespacesRolesCreatePayload,
    NamespacesRolesDeleteInput, NamespacesRolesDeletePayload,
    NamespacesRolesUpdateInput, NamespacesRolesUpdatePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DNamespaceRoleReactiveService extends ReactiveArrayService<DNamespaceRoleView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    getById(id: NamespaceRole['id']): DNamespaceRoleView | undefined {
        return this.values().find(role => role.id === id);
    }

    abstract roleAssignAbilities(payload: NamespacesRolesAssignAbilitiesInput): Promise<NamespacesRolesAssignAbilitiesPayload | undefined>

    abstract roleAssignProject(payload: NamespacesRolesAssignProjectsInput): Promise<NamespacesRolesAssignProjectsPayload | undefined>

    abstract roleCreate(payload: NamespacesRolesCreateInput): Promise<NamespacesRolesCreatePayload | undefined>

    abstract roleDelete(payload: NamespacesRolesDeleteInput): Promise<NamespacesRolesDeletePayload | undefined>

    abstract roleUpdate(payload: NamespacesRolesUpdateInput): Promise<NamespacesRolesUpdatePayload | undefined>
}