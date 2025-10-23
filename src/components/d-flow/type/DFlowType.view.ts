import {
    DataType,
    FlowType,
    FlowTypeSetting,
    Maybe,
    Scalars,
    TranslationConnection
} from "@code0-tech/sagittarius-graphql-types";


export class FlowTypeView {

    /** Time when this FlowType was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Descriptions of the flow type */
    private readonly _descriptions?: Maybe<TranslationConnection>;
    /** Editable status of the flow type */
    private readonly _editable?: Maybe<Scalars['Boolean']['output']>;
    /** Flow type settings of the flow type */
    private readonly _flowTypeSettings?: Maybe<Array<FlowTypeSetting>>;
    /** Global ID of this FlowType */
    private readonly _id?: Maybe<Scalars['TypesFlowTypeID']['output']>;
    /** Identifier of the flow type */
    private readonly _identifier?: Maybe<Scalars['String']['output']>;
    /** Input type of the flow type */
    private readonly _inputType?: Maybe<DataType>;
    /** Names of the flow type */
    private readonly _names?: Maybe<TranslationConnection>;
    /** Return type of the flow type */
    private readonly _returnType?: Maybe<DataType>;
    /** Time when this FlowType was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;


    constructor(flowType: FlowType) {
        this._createdAt = flowType.createdAt;
        this._descriptions = flowType.descriptions;
        this._editable = flowType.editable;
        this._flowTypeSettings = flowType.flowTypeSettings;
        this._id = flowType.id;
        this._identifier = flowType.identifier;
        this._inputType = flowType.inputType;
        this._names = flowType.names;
        this._returnType = flowType.returnType;
        this._updatedAt = flowType.updatedAt;
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get descriptions(): Maybe<TranslationConnection> | undefined {
        return this._descriptions;
    }

    get editable(): Maybe<Scalars["Boolean"]["output"]> | undefined {
        return this._editable;
    }

    get flowTypeSettings(): Maybe<Array<FlowTypeSetting>> | undefined {
        return this._flowTypeSettings;
    }

    get id(): Maybe<Scalars["TypesFlowTypeID"]["output"]> | undefined {
        return this._id;
    }

    get identifier(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._identifier;
    }

    get inputType(): Maybe<DataType> | undefined {
        return this._inputType;
    }

    get names(): Maybe<TranslationConnection> | undefined {
        return this._names;
    }

    get returnType(): Maybe<DataType> | undefined {
        return this._returnType;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }
}