import {
    Maybe, Namespace,
    NamespaceLicenseConnection,
    NamespaceMemberConnection, NamespaceParent, NamespaceProjectConnection, NamespaceRoleConnection, RuntimeConnection,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceView {
    /** Time when this Namespace was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this Namespace */
    private readonly _id?: Maybe<Scalars['NamespaceID']['output']>;
    /** Members of the namespace */
    private readonly _members?: Maybe<NamespaceMemberConnection>;
    /** Licenses of the namespace */
    private readonly _namespaceLicenses?: Maybe<NamespaceLicenseConnection>;
    /** Parent of this namespace */
    private readonly _parent?: Maybe<NamespaceParent>;
    /** Projects of the namespace */
    private readonly _projects?: Maybe<NamespaceProjectConnection>;
    /** Roles of the namespace */
    private readonly _roles?: Maybe<NamespaceRoleConnection>;
    /** Runtime of the namespace */
    private readonly _runtimes?: Maybe<RuntimeConnection>;
    /** Time when this Namespace was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(payload: Namespace) {
        this._createdAt = payload.createdAt;
        this._id = payload.id;
        this._members = payload.members;
        this._namespaceLicenses = payload.namespaceLicenses;
        this._parent = payload.parent;
        this._projects = payload.projects;
        this._roles = payload.roles;
        this._runtimes = payload.runtimes;
        this._updatedAt = payload.updatedAt;
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NamespaceID"]["output"]> | undefined {
        return this._id;
    }

    get members(): Maybe<NamespaceMemberConnection> | undefined {
        return this._members;
    }

    get namespaceLicenses(): Maybe<NamespaceLicenseConnection> | undefined {
        return this._namespaceLicenses;
    }

    get parent(): Maybe<NamespaceParent> | undefined {
        return this._parent;
    }

    get projects(): Maybe<NamespaceProjectConnection> | undefined {
        return this._projects;
    }

    get roles(): Maybe<NamespaceRoleConnection> | undefined {
        return this._roles;
    }

    get runtimes(): Maybe<RuntimeConnection> | undefined {
        return this._runtimes;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    json(): Namespace {
        return {
            createdAt: this._createdAt,
            id: this._id,
            members: this._members,
            namespaceLicenses: this._namespaceLicenses,
            parent: this._parent,
            projects: this._projects,
            roles: this._roles,
            runtimes: this._runtimes,
            updatedAt: this._updatedAt
        };
    }
}