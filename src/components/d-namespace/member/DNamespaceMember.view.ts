import {
    Maybe,
    Namespace,
    NamespaceMember,
    NamespaceMemberRoleConnection, NamespaceMemberUserAbilities, NamespaceRoleConnection,
    Scalars,
    User
} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceMemberView {
    /** Time when this NamespaceMember was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceMember */
    private readonly _id?: Maybe<Scalars['NamespaceMemberID']['output']>;
    /** Memberroles of the member */
    private readonly _memberRoles?: Maybe<NamespaceMemberRoleConnection>;
    /** Namespace this member belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** Roles of the member */
    private readonly _roles?: Maybe<NamespaceRoleConnection>;
    /** Time when this NamespaceMember was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** User this member belongs to */
    private readonly _user?: Maybe<User>;
    /** Abilities for the current user on this NamespaceMember */
    private readonly _userAbilities?: Maybe<NamespaceMemberUserAbilities>;

    constructor(payload: NamespaceMember) {
        this._createdAt = payload.createdAt;
        this._id = payload.id;
        this._memberRoles = payload.memberRoles;
        this._namespace = payload.namespace;
        this._roles = payload.roles;
        this._updatedAt = payload.updatedAt;
        this._user = payload.user;
        this._userAbilities = payload.userAbilities;
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NamespaceMemberID"]["output"]> | undefined {
        return this._id;
    }

    get memberRoles(): Maybe<NamespaceMemberRoleConnection> | undefined {
        return this._memberRoles;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get roles(): Maybe<NamespaceRoleConnection> | undefined {
        return this._roles;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get user(): Maybe<User> | undefined {
        return this._user;
    }

    get userAbilities(): Maybe<NamespaceMemberUserAbilities> | undefined {
        return this._userAbilities;
    }

    json(): NamespaceMember {
        return {
            createdAt: this._createdAt,
            id: this._id,
            memberRoles: this._memberRoles,
            namespace: this._namespace,
            roles: this._roles,
            updatedAt: this._updatedAt,
            user: this._user
        };
    }
}