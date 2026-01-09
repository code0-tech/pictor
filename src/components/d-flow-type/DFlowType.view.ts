import type {
    DataType,
    FlowType,
    FlowTypeSetting,
    Maybe,
    Scalars, Translation,
} from "@code0-tech/sagittarius-graphql-types";
import {DataTypeView} from "../d-flow-data-type";


export class FlowTypeView {

    /** Name of the function */
    private readonly _aliases?: Maybe<Array<Translation>>;
    /** Time when this FlowType was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Descriptions of the flow type */
    private readonly _descriptions?: Maybe<Array<Translation>>;
    /** Display message of the function */
    private readonly _displayMessages?: Maybe<Array<Translation>>;
    /** Editable status of the flow type */
    private readonly _editable?: Maybe<Scalars['Boolean']['output']>;
    /** Flow type settings of the flow type */
    private readonly _flowTypeSettings?: Maybe<Array<FlowTypeSetting>>;
    /** Global ID of this FlowType */
    private readonly _id?: Maybe<Scalars['FlowTypeID']['output']>;
    /** Identifier of the flow type */
    private readonly _identifier?: Maybe<Scalars['String']['output']>;
    /** Input type of the flow type */
    private readonly _inputType?: Maybe<DataType>;
    /** Names of the flow type */
    private readonly _names?: Maybe<Array<Translation>>;
    /** Return type of the flow type */
    private readonly _returnType?: Maybe<DataType>;
    /** Time when this FlowType was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;


    constructor(flowType: FlowType) {
        this._aliases = flowType.aliases;
        this._createdAt = flowType.createdAt;
        this._descriptions = flowType.descriptions;
        this._displayMessages = flowType.displayMessages;
        this._editable = flowType.editable;
        this._flowTypeSettings = flowType.flowTypeSettings;
        this._id = flowType.id;
        this._identifier = flowType.identifier;
        this._inputType = flowType.inputType ? new DataTypeView(flowType.inputType).json : undefined;
        this._names = flowType.names;
        this._returnType = flowType.returnType ? new DataTypeView(flowType.returnType).json : undefined;
        this._updatedAt = flowType.updatedAt;

        console.log(JSON.stringify(this.inputType))
        console.log(this.inputType)
    }

    get aliases(): Maybe<Array<Translation>> | undefined {
        return this._aliases;
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get descriptions(): Maybe<Array<Translation>> | undefined {
        return this._descriptions;
    }

    get displayMessages(): Maybe<Array<Translation>> | undefined {
        return this._displayMessages;
    }

    get editable(): Maybe<Scalars["Boolean"]["output"]> | undefined {
        return this._editable;
    }

    get flowTypeSettings(): Maybe<Array<FlowTypeSetting>> | undefined {
        return this._flowTypeSettings;
    }

    get id(): Maybe<Scalars["FlowTypeID"]["output"]> | undefined {
        return this._id;
    }

    get identifier(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._identifier;
    }

    get inputType(): Maybe<DataType> | undefined {
        return this._inputType;
    }

    get names(): Maybe<Array<Translation>> | undefined {
        return this._names;
    }

    get returnType(): Maybe<DataType> | undefined {
        return this._returnType;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    json(): FlowType {
        return {
            createdAt: this._createdAt,
            descriptions: this._descriptions,
            editable: this._editable,
            flowTypeSettings: this._flowTypeSettings,
            id: this._id,
            identifier: this._identifier,
            inputType: this._inputType,
            names: this._names,
            returnType: this._returnType,
            updatedAt: this._updatedAt
        }
    }
}