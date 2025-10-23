import {
    DataTypeConnection,
    FlowTypeConnection,
    Maybe,
    Namespace,
    NamespaceProjectConnection,
    Runtime,
    RuntimeStatusType,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export class DRuntimeView {

    /** Time when this Runtime was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** DataTypes of the runtime */
    private readonly _dataTypes?: Maybe<DataTypeConnection>;
    /** The description for the runtime if present */
    private readonly _description?: Maybe<Scalars['String']['output']>;
    /** FlowTypes of the runtime */
    private readonly _flowTypes?: Maybe<FlowTypeConnection>;
    /** Global ID of this Runtime */
    private readonly _id?: Maybe<Scalars['RuntimeID']['output']>;
    /** The name for the runtime */
    private readonly _name?: Maybe<Scalars['String']['output']>;
    /** The parent namespace for the runtime */
    private readonly _namespace?: Maybe<Namespace>;
    /** Projects associated with the runtime */
    private readonly _projects?: Maybe<NamespaceProjectConnection>;
    /** The status of the runtime */
    private readonly _status?: Maybe<RuntimeStatusType>;
    /** Token belonging to the runtime, only present on creation */
    private readonly _token?: Maybe<Scalars['String']['output']>;
    /** Time when this Runtime was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(payload: Runtime) {
        this._createdAt = payload.createdAt;
        this._dataTypes = payload.dataTypes;
        this._description = payload.description;
        this._flowTypes = payload.flowTypes;
        this._id = payload.id;
        this._name = payload.name;
        this._namespace = payload.namespace;
        this._projects = payload.projects;
        this._status = payload.status;
        this._token = payload.token;
        this._updatedAt = payload.updatedAt;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get dataTypes(): Maybe<DataTypeConnection> | undefined {
        return this._dataTypes;
    }

    get description(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._description;
    }

    get flowTypes(): Maybe<FlowTypeConnection> | undefined {
        return this._flowTypes;
    }

    get id(): Maybe<Scalars["RuntimeID"]["output"]> | undefined {
        return this._id;
    }

    get name(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._name;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get projects(): Maybe<NamespaceProjectConnection> | undefined {
        return this._projects;
    }

    get status(): Maybe<RuntimeStatusType> | undefined {
        return this._status;
    }

    get token(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._token;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }
}