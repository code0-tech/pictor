import {
    Maybe,
    NamespacesMembersAssignRolesInput,
    NamespacesMembersDeleteInput,
    NamespacesMembersInviteInput, Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export interface DNamespaceMemberService {
    membersInvite(payload: NamespacesMembersInviteInput): DNamespaceMemberView | undefined

    membersDelete(payload: NamespacesMembersDeleteInput): void

    membersAssignRoles(payload: NamespacesMembersAssignRolesInput): DNamespaceMemberView | undefined

    findById(id: Maybe<Scalars['NamespaceMemberID']['output']>): DNamespaceMemberView | undefined
}

export class DNamespaceMemberReactiveService extends ReactiveArrayService<DNamespaceMemberView> implements DNamespaceMemberService {

    constructor(payload: ReactiveArrayStore<DNamespaceMemberView>) {
        super(payload);
    }

    findById(id: Maybe<Scalars["NamespaceMemberID"]["output"]>): DNamespaceMemberView | undefined {
        return this.values().find(member => member.id === id);
    }

    membersAssignRoles(payload: NamespacesMembersAssignRolesInput): DNamespaceMemberView | undefined {
        return undefined;
    }

    membersDelete(payload: NamespacesMembersDeleteInput): void {
        if (this.findById(payload.namespaceMemberId)) {
            const index = this.values().findIndex(member => member.id === payload.namespaceMemberId);
            this.delete(index);
            this.update()
        }
    }

    membersInvite(payload: NamespacesMembersInviteInput): DNamespaceMemberView | undefined {
        return undefined;
    }


}