import {Maybe, Namespace, Organization, Scalars} from "@code0-tech/sagittarius-graphql-types";

export class DOrgaView {

    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this Organization */
    private readonly _id?: Maybe<Scalars['OrganizationID']['output']>;
    /** Name of the organization */
    private _name?: Maybe<Scalars['String']['output']>;
    /** Namespace of this organization */
    private readonly _namespace?: Maybe<Namespace>;
    /** Time when this Organization was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(payload: Organization) {
        this._createdAt = payload.createdAt;
        this._id = payload.id;
        this._name = payload.name;
        this._namespace = payload.namespace;
        this._updatedAt = payload.updatedAt;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["OrganizationID"]["output"] | undefined> {
        return this._id;
    }

    get name(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._name;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    set name(value: Maybe<Scalars["String"]["output"]>) {
        this._name = value;
    }
}