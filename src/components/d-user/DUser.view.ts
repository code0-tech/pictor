import {Maybe, Namespace, NamespaceMemberConnection, Scalars, User} from "@code0-tech/sagittarius-graphql-types";

export const DUserViewQuery = `



`

export class DUserView {

    /** Global admin status of the user */
    private _admin?: Maybe<Scalars['Boolean']['output']>;
    /** The avatar if present of the user */
    private _avatarPath?: Maybe<Scalars['String']['output']>;
    /** Time when this User was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Email of the user */
    private _email?: Maybe<Scalars['String']['output']>;
    /** Firstname of the user */
    private _firstname?: Maybe<Scalars['String']['output']>;
    /** Global ID of this User */
    private readonly _id?: Maybe<Scalars['UserID']['output']>;
    /** Lastname of the user */
    private _lastname?: Maybe<Scalars['String']['output']>;
    /** Namespace of this user */
    private readonly _namespace?: Maybe<Namespace>;
    /** Namespace Memberships of this user */
    private readonly _namespaceMemberships?: Maybe<NamespaceMemberConnection>;
    /** Time when this User was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** Username of the user */
    private _username?: Maybe<Scalars['String']['output']>;

    constructor(user: User) {
        this._admin = user.admin;
        this._avatarPath = user.avatarPath;
        this._createdAt = user.createdAt;
        this._email = user.email;
        this._firstname = user.firstname;
        this._id = user.id;
        this._lastname = user.lastname;
        this._namespace = user.namespace;
        this._namespaceMemberships = user.namespaceMemberships;
        this._updatedAt = user.updatedAt;
        this._username = user.username;
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

    get firstname(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._firstname;
    }

    get id(): Maybe<Scalars["UserID"]["output"]> | undefined {
        return this._id;
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

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get username(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._username;
    }

    set admin(value: Maybe<Scalars["Boolean"]["output"]>) {
        this._admin = value;
    }

    set avatarPath(value: Maybe<Scalars["String"]["output"]>) {
        this._avatarPath = value;
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
}