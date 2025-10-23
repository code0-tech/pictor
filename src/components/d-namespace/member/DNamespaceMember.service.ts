import {
    Maybe,
    NamespacesMembersAssignRolesInput,
    NamespacesMembersDeleteInput,
    NamespacesMembersInviteInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceMemberView} from "./DNamespaceMember.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";

export abstract class DNamespaceMemberService extends ReactiveArrayService<DNamespaceMemberView> {

    constructor(payload: ReactiveArrayStore<DNamespaceMemberView>) {
        super(payload);
    }

    abstract membersInvite(payload: NamespacesMembersInviteInput): DNamespaceMemberView | undefined

    abstract membersDelete(payload: NamespacesMembersDeleteInput): void

    abstract membersAssignRoles(payload: NamespacesMembersAssignRolesInput): DNamespaceMemberView | undefined

    abstract findById(id: Maybe<Scalars['NamespaceMemberID']['output']>): DNamespaceMemberView | undefined
}

export abstract class DNamespaceMemberReactiveService extends DNamespaceMemberService {

    findById(id: Maybe<Scalars["NamespaceMemberID"]["output"]>): DNamespaceMemberView | undefined {
        return this.values().find(member => member.id === id);
    }

    abstract override membersAssignRoles(payload: NamespacesMembersAssignRolesInput): DNamespaceMemberView | undefined

    abstract override membersDelete(payload: NamespacesMembersDeleteInput): void

    abstract override membersInvite(payload: NamespacesMembersInviteInput): DNamespaceMemberView | undefined


}