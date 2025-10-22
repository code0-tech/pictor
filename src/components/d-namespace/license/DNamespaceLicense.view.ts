import {Maybe, Namespace, NamespaceLicense, Scalars} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceLicenseView {
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceLicense */
    private readonly _id?: Maybe<Scalars['NamespaceLicenseID']['output']>;
    /** The namespace the license belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** Time when this NamespaceLicense was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(payload: NamespaceLicense) {
        this._createdAt = payload.createdAt;
        this._id = payload.id;
        this._namespace = payload.namespace;
        this._updatedAt = payload.updatedAt;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NamespaceLicenseID"]["output"]> | undefined {
        return this._id;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }
}