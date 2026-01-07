import type {
    DataType,
    DataTypeRuleConnection,
    DataTypeVariant, Maybe, Runtime, Scalars, Translation,
} from "@code0-tech/sagittarius-graphql-types";


export class DataTypeView {

    /** Name of the function */
    private readonly _aliases?: Maybe<Array<Translation>>;
    /** Time when this DataType was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Display message of the function */
    private readonly _displayMessages?: Maybe<Array<Translation>>;
    /** Generic keys of the datatype */
    private readonly _genericKeys?: Maybe<Array<Scalars['String']['output']>>;
    /** Global ID of this DataType */
    private readonly _id?: Maybe<Scalars['DataTypeID']['output']>;
    /** The identifier scoped to the namespace */
    private readonly _identifier?: Maybe<Scalars['String']['output']>;
    /** Names of the flow type setting */
    private readonly _name?: Maybe<Array<Translation>>;
    /** Rules of the datatype */
    private readonly _rules?: Maybe<DataTypeRuleConnection>;
    /** The namespace where this datatype belongs to */
    private readonly _runtime?: Maybe<Runtime>;
    /** Time when this DataType was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The type of the datatype */
    private readonly _variant?: Maybe<DataTypeVariant>;

    constructor(dataType: DataType) {
        this._aliases = dataType.aliases;
        this._createdAt = dataType.createdAt;
        this._displayMessages = dataType.displayMessages;
        this._genericKeys = dataType.genericKeys;
        this._id = dataType.id;
        this._identifier = dataType.identifier;
        this._name = dataType.name;
        this._runtime = dataType.runtime;
        this._rules = dataType.rules;
        this._updatedAt = dataType.updatedAt;
        this._variant = dataType.variant;
    }

    get aliases(): Maybe<Array<Translation>> | undefined {
        return this._aliases;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get displayMessages(): Maybe<Array<Translation>> | undefined {
        return this._displayMessages;
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

    get name(): Maybe<Array<Translation>> | undefined {
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

    get json(): DataType {
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