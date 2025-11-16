import {
    Maybe,
    Namespace,
    NamespaceMemberConnection,
    Scalars,
    User,
    UserIdentityConnection, UserSessionConnection, UserUserAbilities
} from "@code0-tech/sagittarius-graphql-types";

export class DUserView {

    /** Global admin status of the user */
    private _admin?: Maybe<Scalars['Boolean']['output']>;
    /** The avatar if present of the user */
    private readonly _avatarPath?: Maybe<Scalars['String']['output']>;
    /** Time when this User was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Email of the user */
    private _email?: Maybe<Scalars['String']['output']>;
    /** Email verification date of the user if present */
    private readonly _emailVerifiedAt?: Maybe<Scalars['Time']['output']>;
    /** Firstname of the user */
    private _firstname?: Maybe<Scalars['String']['output']>;
    /** Global ID of this User */
    private readonly _id?: Maybe<Scalars['UserID']['output']>;
    /** Identities of this user */
    private readonly _identities?: Maybe<UserIdentityConnection>;
    /** Lastname of the user */
    private _lastname?: Maybe<Scalars['String']['output']>;
    /** Namespace of this user */
    private readonly _namespace?: Maybe<Namespace>;
    /** Namespace Memberships of this user */
    private readonly _namespaceMemberships?: Maybe<NamespaceMemberConnection>;
    /** Sessions of this user */
    private readonly _sessions?: Maybe<UserSessionConnection>;
    /** Time when this User was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** Username of the user */
    private _username?: Maybe<Scalars['String']['output']>;
    /** Abilities for the current user on this User */
    private readonly _userAbilities?: Maybe<UserUserAbilities>;

    constructor(user: User) {
        this._admin = user.admin;
        this._avatarPath = user.avatarPath;
        this._createdAt = user.createdAt;
        this._email = user.email;
        this._emailVerifiedAt = user.emailVerifiedAt;
        this._firstname = user.firstname;
        this._id = user.id;
        this._identities = user.identities;
        this._lastname = user.lastname;
        this._namespace = user.namespace;
        this._namespaceMemberships = user.namespaceMemberships;
        this._sessions = user.sessions;
        this._updatedAt = user.updatedAt;
        this._username = user.username;
        this._userAbilities = user.userAbilities;

    }

    get admin(): Maybe<Scalars["Boolean"]["output"]> | undefined {
        return this._admin;
    }

    get avatarPath(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._avatarPath;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get email(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._email;
    }

    get emailVerifiedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._emailVerifiedAt;
    }

    get firstname(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._firstname;
    }

    get id(): Maybe<Scalars["UserID"]["output"]> | undefined {
        return this._id;
    }

    get identities(): Maybe<UserIdentityConnection> | undefined {
        return this._identities;
    }

    get lastname(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._lastname;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get namespaceMemberships(): Maybe<NamespaceMemberConnection> | undefined {
        return this._namespaceMemberships;
    }

    get sessions(): Maybe<UserSessionConnection> | undefined {
        return this._sessions;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get username(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._username;
    }

    get userAbilities(): Maybe<UserUserAbilities> | undefined {
        return this._userAbilities;
    }

    set admin(value: Maybe<Scalars["Boolean"]["output"]>) {
        this._admin = value;
    }

    set email(value: Maybe<Scalars["String"]["output"]>) {
        this._email = value;
    }

    set firstname(value: Maybe<Scalars["String"]["output"]>) {
        this._firstname = value;
    }

    set lastname(value: Maybe<Scalars["String"]["output"]>) {
        this._lastname = value;
    }

    set username(value: Maybe<Scalars["String"]["output"]>) {
        this._username = value;
    }

    json(): User {
        return {
            admin: this._admin,
            avatarPath: this._avatarPath,
            createdAt: this._createdAt,
            email: this._email,
            emailVerifiedAt: this._emailVerifiedAt,
            firstname: this._firstname,
            id: this._id,
            identities: this._identities,
            lastname: this._lastname,
            namespace: this._namespace,
            namespaceMemberships: this._namespaceMemberships,
            sessions: this._sessions,
            updatedAt: this._updatedAt,
            username: this._username,
        };
    }
}