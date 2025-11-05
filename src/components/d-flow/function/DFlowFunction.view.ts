import {
    DataTypeIdentifier,
    FunctionDefinition,
    Maybe, ParameterDefinition,
    RuntimeFunctionDefinition,
    Scalars,
    TranslationConnection
} from "@code0-tech/sagittarius-graphql-types";

export class FunctionDefinitionView {

    /** Time when this FunctionDefinition was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Deprecation message of the function */
    private readonly _deprecationMessages?: Maybe<TranslationConnection>;
    /** Description of the function */
    private readonly _descriptions?: Maybe<TranslationConnection>;
    /** Documentation of the function */
    private readonly _documentations?: Maybe<TranslationConnection>;
    /** Generic keys of the function */
    private readonly _genericKeys?: Maybe<Array<Scalars['String']['output']>>;
    /** Global ID of this FunctionDefinition */
    private readonly _id?: Maybe<Scalars['FunctionDefinitionID']['output']>;
    /** Name of the function */
    private readonly _names?: Maybe<TranslationConnection>;
    /** Parameters of the function */
    private readonly _parameterDefinitions?: Maybe<ParameterDefinitionView[]>;
    /** Return type of the function */
    private readonly _returnType?: Maybe<DataTypeIdentifier>;
    /** Runtime function definition */
    private readonly _runtimeFunctionDefinition?: Maybe<RuntimeFunctionDefinition>;
    /** Indicates if the function can throw an error */
    private readonly _throwsError?: Maybe<Scalars['Boolean']['output']>;
    /** Time when this FunctionDefinition was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(object: FunctionDefinition) {
        this._createdAt = object.createdAt;
        this._deprecationMessages = object.deprecationMessages;
        this._descriptions = object.descriptions;
        this._documentations = object.documentations;
        this._genericKeys = object.genericKeys;
        this._id = object.id;
        this._names = object.names;
        this._parameterDefinitions = object.parameterDefinitions?.nodes?.map(definition => new ParameterDefinitionView(definition!!)) ?? undefined;
        this._returnType = object.returnType;
        this._runtimeFunctionDefinition = object.runtimeFunctionDefinition;
        this._throwsError = object.throwsError;
        this._updatedAt = object.updatedAt;
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get deprecationMessages(): Maybe<TranslationConnection> | undefined {
        return this._deprecationMessages;
    }

    get descriptions(): Maybe<TranslationConnection> | undefined {
        return this._descriptions;
    }

    get documentations(): Maybe<TranslationConnection> | undefined {
        return this._documentations;
    }

    get genericKeys(): Maybe<Array<Scalars["String"]["output"]>> | undefined {
        return this._genericKeys;
    }

    get id(): Maybe<Scalars["FunctionDefinitionID"]["output"]> | undefined {
        return this._id;
    }

    get names(): Maybe<TranslationConnection> | undefined {
        return this._names;
    }

    get parameterDefinitions(): Maybe<ParameterDefinitionView[]> | undefined {
        return this._parameterDefinitions;
    }

    get returnType(): Maybe<DataTypeIdentifier> | undefined {
        return this._returnType;
    }

    get runtimeFunctionDefinition(): Maybe<RuntimeFunctionDefinition> | undefined {
        return this._runtimeFunctionDefinition;
    }

    get throwsError(): Maybe<Scalars["Boolean"]["output"]> | undefined {
        return this._throwsError;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    json(): FunctionDefinition {
        return {
            createdAt: this._createdAt,
            deprecationMessages: this._deprecationMessages,
            descriptions: this._descriptions,
            documentations: this._documentations,
            genericKeys: this._genericKeys,
            id: this._id,
            names: this._names,
            parameterDefinitions: this._parameterDefinitions ? {
                nodes: this._parameterDefinitions.map(definitionView => definitionView.json()!!)
            } : undefined,
            returnType: this._returnType,
            runtimeFunctionDefinition: this._runtimeFunctionDefinition,
            throwsError: this._throwsError,
            updatedAt: this._updatedAt
        }
    }
}

export class ParameterDefinitionView {

    /** Time when this ParameterDefinition was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Data type of the parameter */
    private readonly _dataTypeIdentifier?: Maybe<DataTypeIdentifier>;
    /** Description of the parameter */
    private readonly _descriptions?: Maybe<TranslationConnection>;
    /** Documentation of the parameter */
    private readonly _documentations?: Maybe<TranslationConnection>;
    /** Global ID of this ParameterDefinition */
    private readonly _id?: Maybe<Scalars['ParameterDefinitionID']['output']>;
    /** Name of the parameter */
    private readonly _names?: Maybe<TranslationConnection>;
    /** Time when this ParameterDefinition was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(object: ParameterDefinition) {
        this._createdAt = object.createdAt;
        this._dataTypeIdentifier = object.dataTypeIdentifier;
        this._descriptions = object.descriptions;
        this._documentations = object.documentations;
        this._id = object.id;
        this._names = object.names;
        this._updatedAt = object.updatedAt;
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get dataTypeIdentifier(): Maybe<DataTypeIdentifier> | undefined {
        return this._dataTypeIdentifier;
    }

    get descriptions(): Maybe<TranslationConnection> | undefined {
        return this._descriptions;
    }

    get documentations(): Maybe<TranslationConnection> | undefined {
        return this._documentations;
    }

    get id(): Maybe<Scalars["ParameterDefinitionID"]["output"]> | undefined {
        return this._id;
    }

    get names(): Maybe<TranslationConnection> | undefined {
        return this._names;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    json(): ParameterDefinition {
        return {
            createdAt: this._createdAt,
            dataTypeIdentifier: this._dataTypeIdentifier,
            descriptions: this._descriptions,
            documentations: this._documentations,
            id: this._id,
            names: this._names,
            updatedAt: this._updatedAt
        }
    }
}

