import {
    DataType,
    DataTypeRuleConnection,
    DataTypeVariant, Maybe, Runtime, Scalars,
    TranslationConnection
} from "@code0-tech/sagittarius-graphql-types";

/*
    @todo is DataType castable to another DataType
 */
export class DataTypeView {

    /** Time when this DataType was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Generic keys of the datatype */
    private readonly _genericKeys?: Maybe<Array<Scalars['String']['output']>>;
    /** Global ID of this DataType */
    private readonly _id?: Maybe<Scalars['DataTypeID']['output']>;
    /** The identifier scoped to the namespace */
    private readonly _identifier?: Maybe<Scalars['String']['output']>;
    /** Names of the flow type setting */
    private readonly _name?: Maybe<TranslationConnection>;
    /** The namespace where this datatype belongs to */
    private readonly _runtime?: Maybe<Runtime>;
    /** Rules of the datatype */
    private readonly _rules?: Maybe<DataTypeRuleConnection>;
    /** Time when this DataType was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The type of the datatype */
    private readonly _variant?: Maybe<DataTypeVariant>;

    constructor(dataType: DataType) {
        this._id = dataType.id
        this._createdAt = dataType.createdAt
        this._updatedAt = dataType.updatedAt
        this._identifier = dataType.identifier
        this._name = dataType.name ?? undefined
        this._runtime = dataType.runtime ?? undefined
        this._variant = dataType.variant
        this._genericKeys = dataType.genericKeys ?? undefined
        this._rules = dataType.rules ?? undefined

    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get genericKeys(): Maybe<Array<Scalars["String"]["output"]>> | undefined {
        return this._genericKeys;
    }

    get id(): Maybe<Scalars["DataTypeID"]["output"]> | undefined {
        return this._id;
    }

    get identifier(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._identifier;
    }

    get name(): Maybe<TranslationConnection> | undefined {
        return this._name;
    }

    get runtime(): Maybe<Runtime> | undefined {
        return this._runtime;
    }

    get rules(): Maybe<DataTypeRuleConnection> | undefined {
        return this._rules;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get variant(): Maybe<DataTypeVariant> | undefined {
        return this._variant;
    }

    get json(): DataType | undefined {
        return {
            id: this._id,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            identifier: this._identifier,
            name: this._name,
            runtime: this._runtime,
            variant: this._variant,
            genericKeys: this._genericKeys,
            rules: this._rules
        }
    }
}