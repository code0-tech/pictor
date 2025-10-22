import {Maybe, Namespace, NamespaceMember, Scalars, User} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceMemberView {
    /** Time when this NamespaceMember was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceMember */
    private readonly _id?: Maybe<Scalars['NamespaceMemberID']['output']>;
    /** Namespace this member belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** Time when this NamespaceMember was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** User this member belongs to */
    private readonly _user?: Maybe<User>;

    constructor(payload: NamespaceMember) {
        this._createdAt = payload.createdAt;
        this._id = payload.id;
        this._namespace = payload.namespace;
        this._updatedAt = payload.updatedAt;
        this._user = payload.user;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NamespaceMemberID"]["output"]> | undefined {
        return this._id;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get user(): Maybe<User> | undefined {
        return this._user;
    }
}