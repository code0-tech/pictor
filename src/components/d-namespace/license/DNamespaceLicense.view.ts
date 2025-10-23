import {Maybe, Namespace, NamespaceLicense, Scalars} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceLicenseView {
    /** Time when this NamespaceLicense was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** The end date of the license */
    private readonly _endDate?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NamespaceLicense */
    private readonly _id?: Maybe<Scalars['NamespaceLicenseID']['output']>;
    /** The licensee information */
    private readonly _licensee?: Maybe<Scalars['JSON']['output']>;
    /** The namespace the license belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** The start date of the license */
    private readonly _startDate?: Maybe<Scalars['Time']['output']>;
    /** Time when this NamespaceLicense was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(payload: NamespaceLicense) {
        this._createdAt = payload.createdAt;
        this._endDate = payload.endDate;
        this._id = payload.id;
        this._licensee = payload.licensee;
        this._namespace = payload.namespace;
        this._startDate = payload.startDate;
        this._updatedAt = payload.updatedAt;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get endDate(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._endDate;
    }

    get id(): Maybe<Scalars["NamespaceLicenseID"]["output"]> | undefined {
        return this._id;
    }

    get licensee(): Maybe<Scalars["JSON"]["output"]> | undefined {
        return this._licensee;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get startDate(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._startDate;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }
}