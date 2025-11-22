import {
    Namespace,
    NamespaceMember,
    NamespacesMembersAssignRolesInput,
    NamespacesMembersAssignRolesPayload,
    NamespacesMembersDeleteInput,
    NamespacesMembersDeletePayload,
    NamespacesMembersInviteInput,
    NamespacesMembersInvitePayload,
    User
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {ReactiveArrayService} from "../../utils";

export type DMemberDependencies = {
    namespaceId: Namespace['id']
}

export abstract class DNamespaceMemberReactiveService extends ReactiveArrayService<DNamespaceMemberView, DMemberDependencies> {

    getById(id: NamespaceMember['id'], dependencies?: DMemberDependencies): DNamespaceMemberView | undefined {
        return this.values(dependencies).find(member => member.id === id);
    }

    getByNamespaceIdAndUserId(namespaceId: Namespace['id'], userId: User['id']): DNamespaceMemberView | undefined {
        return this.values().find(member => member.namespace?.id === namespaceId && member.user?.id === userId)
    }

    abstract memberInvite(payload: NamespacesMembersInviteInput): Promise<NamespacesMembersInvitePayload | undefined>

    abstract memberDelete(payload: NamespacesMembersDeleteInput): Promise<NamespacesMembersDeletePayload | undefined>

    abstract memberAssignRoles(payload: NamespacesMembersAssignRolesInput): Promise<NamespacesMembersAssignRolesPayload | undefined>

}