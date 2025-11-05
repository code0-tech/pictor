import {
    Maybe, NamespaceMember,
    NamespacesMembersAssignRolesInput, NamespacesMembersAssignRolesPayload,
    NamespacesMembersDeleteInput, NamespacesMembersDeletePayload,
    NamespacesMembersInviteInput, NamespacesMembersInvitePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export abstract class DNamespaceMemberReactiveService extends ReactiveArrayService<DNamespaceMemberView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    findById(id: NamespaceMember['id']): DNamespaceMemberView | undefined {
        return this.values().find(member => member.id === id);
    }

    abstract memberInvite(payload: NamespacesMembersInviteInput): Promise<NamespacesMembersInvitePayload | undefined>

    abstract memberDelete(payload: NamespacesMembersDeleteInput): Promise<NamespacesMembersDeletePayload | undefined>

    abstract memberAssignRoles(payload: NamespacesMembersAssignRolesInput): Promise<NamespacesMembersAssignRolesPayload | undefined>

}