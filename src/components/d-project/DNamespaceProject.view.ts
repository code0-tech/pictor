import {
    Flow,
    FlowConnection,
    Maybe,
    Namespace, NamespaceProject, NamespaceProjectUserAbilities,
    Runtime,
    RuntimeConnection,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export class DNamespaceProjectView {
    /** Time when this NamespaceProject was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Description of the project */
    private readonly _description?: Maybe<Scalars['String']['output']>;
    /** Fetches an flow given by its ID */
    private readonly _flow?: Maybe<Flow>;
    /** Fetches all flows in this project */
    private readonly _flows?: Maybe<FlowConnection>;
    /** Global ID of this NamespaceProject */
    private readonly _id?: Maybe<Scalars['NamespaceProjectID']['output']>;
    /** Name of the project */
    private readonly _name?: Maybe<Scalars['String']['output']>;
    /** The namespace where this project belongs to */
    private readonly _namespace?: Maybe<Namespace>;
    /** The primary runtime for the project */
    private readonly _primaryRuntime?: Maybe<Runtime>;
    /** Runtimes assigned to this project */
    private readonly _runtimes?: Maybe<RuntimeConnection>;
    /** Time when this NamespaceProject was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** Abilities for the current user on this NamespaceProject */
    private readonly _userAbilities?: Maybe<NamespaceProjectUserAbilities>;

    constructor(payload: NamespaceProject) {
        this._createdAt = payload.createdAt;
        this._description = payload.description;
        this._flow = payload.flow;
        this._flows = payload.flows;
        this._id = payload.id;
        this._name = payload.name;
        this._namespace = payload.namespace;
        this._primaryRuntime = payload.primaryRuntime;
        this._runtimes = payload.runtimes;
        this._updatedAt = payload.updatedAt;
        this._userAbilities = payload.userAbilities;
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get description(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._description;
    }

    get flow(): Maybe<Flow> | undefined {
        return this._flow;
    }

    get flows(): Maybe<FlowConnection> | undefined {
        return this._flows;
    }

    get id(): Maybe<Scalars["NamespaceProjectID"]["output"]> | undefined {
        return this._id;
    }

    get name(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._name;
    }

    get namespace(): Maybe<Namespace> | undefined {
        return this._namespace;
    }

    get primaryRuntime(): Maybe<Runtime> | undefined {
        return this._primaryRuntime;
    }

    get runtimes(): Maybe<RuntimeConnection> | undefined {
        return this._runtimes;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get userAbilities(): Maybe<NamespaceProjectUserAbilities> | undefined {
        return this._userAbilities;
    }

    json(): NamespaceProject {
        return {
            createdAt: this._createdAt,
            description: this._description,
            flow: this._flow,
            flows: this._flows,
            id: this._id,
            name: this._name,
            namespace: this._namespace,
            primaryRuntime: this._primaryRuntime,
            runtimes: this._runtimes,
            updatedAt: this._updatedAt
        };
    }
}