import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DNamespaceRoleView} from "./DNamespaceRole.view";
import {
    Namespace,
    NamespaceRole,
    NamespacesRolesAssignAbilitiesInput, NamespacesRolesAssignAbilitiesPayload,
    NamespacesRolesAssignProjectsInput, NamespacesRolesAssignProjectsPayload,
    NamespacesRolesCreateInput, NamespacesRolesCreatePayload,
    NamespacesRolesDeleteInput, NamespacesRolesDeletePayload,
    NamespacesRolesUpdateInput, NamespacesRolesUpdatePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export type DRoleDependencies = {
    namespaceId: Namespace['id']
}

export abstract class DNamespaceRoleReactiveService extends ReactiveArrayService<DNamespaceRoleView, DRoleDependencies> {

    getById(id: NamespaceRole['id']): DNamespaceRoleView | undefined {
        return this.values().find(role => role.id === id);
    }

    abstract roleAssignAbilities(payload: NamespacesRolesAssignAbilitiesInput): Promise<NamespacesRolesAssignAbilitiesPayload | undefined>

    abstract roleAssignProject(payload: NamespacesRolesAssignProjectsInput): Promise<NamespacesRolesAssignProjectsPayload | undefined>

    abstract roleCreate(payload: NamespacesRolesCreateInput): Promise<NamespacesRolesCreatePayload | undefined>

    abstract roleDelete(payload: NamespacesRolesDeleteInput): Promise<NamespacesRolesDeletePayload | undefined>

}