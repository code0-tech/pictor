import {
    Maybe, Namespace, NamespaceMember,
    NamespacesMembersAssignRolesInput, NamespacesMembersAssignRolesPayload,
    NamespacesMembersDeleteInput, NamespacesMembersDeletePayload,
    NamespacesMembersInviteInput, NamespacesMembersInvitePayload,
    Scalars, User
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export abstract class DNamespaceMemberReactiveService extends ReactiveArrayService<DNamespaceMemberView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    getById(id: NamespaceMember['id']): DNamespaceMemberView | undefined {
        return this.values().find(member => member.id === id);
    }

    getByNamespaceIdAndUserId(namespaceId: Namespace['id'], userId: User['id']): DNamespaceMemberView | undefined {
        return this.values().find(member => member.namespace?.id === namespaceId && member.user?.id === userId)
    }

    abstract memberInvite(payload: NamespacesMembersInviteInput): Promise<NamespacesMembersInvitePayload | undefined>

    abstract memberDelete(payload: NamespacesMembersDeleteInput): Promise<NamespacesMembersDeletePayload | undefined>

    abstract memberAssignRoles(payload: NamespacesMembersAssignRolesInput): Promise<NamespacesMembersAssignRolesPayload | undefined>

}