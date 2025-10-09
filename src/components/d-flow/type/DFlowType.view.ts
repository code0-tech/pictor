import {DataType, FlowType, Maybe, Scalars, TranslationConnection} from "@code0-tech/sagittarius-graphql-types";


export class FlowTypeView {

    private readonly _id: Scalars['TypesFlowTypeID']['output']
    private readonly _identifier: Scalars['String']['output']
    private readonly _createdAt:  Scalars['Time']['output']
    private readonly _updatedAt:  Scalars['Time']['output']
    private readonly _descriptions:  Maybe<TranslationConnection> | undefined
    private readonly _names:  Maybe<TranslationConnection> | undefined
    private readonly _editable: Scalars['Boolean']['output']
    private readonly _inputType: Maybe<DataType> | undefined
    private readonly _returnType: Maybe<DataType> | undefined
    //TODO: settings but their is a problem with type in settings


    constructor(flowType: FlowType) {
        this._id = flowType.id
        this._identifier = flowType.identifier
        this._createdAt = flowType.createdAt
        this._updatedAt = flowType.updatedAt
        this._descriptions = flowType.descriptions ?? undefined
        this._names = flowType.names ?? undefined
        this._editable = flowType.editable
        this._inputType = flowType.inputType ?? undefined
        this._returnType = flowType.returnType ?? undefined
    }


    get id(): Scalars["TypesFlowTypeID"]["output"] {
        return this._id;
    }

    get identifier(): Scalars["String"]["output"] {
        return this._identifier;
    }

    get createdAt(): Scalars["Time"]["output"] {
        return this._createdAt;
    }

    get updatedAt(): Scalars["Time"]["output"] {
        return this._updatedAt;
    }

    get descriptions(): Maybe<TranslationConnection> | undefined {
        return this._descriptions;
    }

    get names(): Maybe<TranslationConnection> | undefined {
        return this._names;
    }

    get editable(): Scalars["Boolean"]["output"] {
        return this._editable;
    }

    get inputType(): Maybe<DataType> | undefined {
        return this._inputType;
    }

    get returnType(): Maybe<DataType> | undefined {
        return this._returnType;
    }
}