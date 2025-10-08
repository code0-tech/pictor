import {
    DataType,
    Flow,
    FlowType, LiteralValue,
    Maybe,
    NodeFunction,
    NodeParameter, NodeParameterValue, ReferenceValue,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export class FlowView {

    private readonly _id: Scalars['FlowID']['output']
    private readonly _createdAt:  Scalars['Time']['output']
    private readonly _updatedAt:  Scalars['Time']['output']
    private _inputType: Maybe<DataType> | undefined
    private _returnType: Maybe<DataType> | undefined
    //TODO: settings
    private _startingNode: NodeFunctionView
    private readonly _type: FlowType

    constructor(flow: Flow) {

        this._id = flow.id
        this._createdAt = flow.createdAt
        this._updatedAt = flow.updatedAt
        this._inputType = flow.inputType ?? undefined
        this._returnType = flow.returnType ?? undefined
        this._type = flow.type
        this._startingNode = new NodeFunctionView(flow.startingNode)

    }


    get id(): Scalars["FlowID"]["output"] {
        return this._id;
    }

    get createdAt(): Scalars["Time"]["output"] {
        return this._createdAt;
    }

    get updatedAt(): Scalars["Time"]["output"] {
        return this._updatedAt;
    }

    get inputType(): Maybe<DataType> | undefined {
        return this._inputType;
    }

    get returnType(): Maybe<DataType> | undefined {
        return this._returnType;
    }

    get startingNode(): NodeFunctionView {
        return this._startingNode;
    }

    get type(): FlowType {
        return this._type;
    }
}

export class NodeFunctionView {


    private readonly _id: Scalars['NodeFunctionID']['output']
    private readonly _runtimeId: Scalars['RuntimeParameterDefinitionID']['output']
    private readonly _createdAt:  Scalars['Time']['output']
    private readonly _updatedAt:  Scalars['Time']['output']
    private _nextNode: NodeFunctionView | undefined
    private _parameters: NodeFunctionParameter[] | undefined


    constructor(nodeFunction: NodeFunction) {
        this._id = nodeFunction.id
        this._runtimeId = nodeFunction.runtimeFunction.id
        this._createdAt = nodeFunction.createdAt
        this._updatedAt = nodeFunction.updatedAt
        this._nextNode = nodeFunction.nextNode ? new NodeFunctionView(nodeFunction.nextNode) : undefined
        this._parameters = nodeFunction.parameters ? nodeFunction.parameters.nodes?.map(param => new NodeFunctionParameter(param)) : undefined
    }


}

export class NodeFunctionParameter {

    private readonly _id: Scalars['NodeParameterID']['output']
    private readonly _runtimeId: Scalars['RuntimeParameterDefinitionID']['output']
    private readonly _createdAt:  Scalars['Time']['output']
    private readonly _updatedAt:  Scalars['Time']['output']
    private _value: LiteralValue | NodeFunctionView | ReferenceValue | undefined

    constructor(nodeParameter: NodeParameter) {
        this._id = nodeParameter.id
        this._runtimeId = nodeParameter.runtimeParameter.id
        this._createdAt = nodeParameter.createdAt
        this._updatedAt = nodeParameter.updatedAt
        if (nodeParameter.value?.__typename === "NodeFunction") {
            this._value = new NodeFunctionView(nodeParameter.value as NodeFunction);
        } else {
            this._value = nodeParameter.value as LiteralValue | ReferenceValue;
        }

    }

    get id(): Scalars["NodeParameterID"]["output"] {
        return this._id;
    }

    get runtimeId(): Scalars["RuntimeParameterDefinitionID"]["output"] {
        return this._runtimeId;
    }

    get createdAt(): Scalars["Time"]["output"] {
        return this._createdAt;
    }

    get updatedAt(): Scalars["Time"]["output"] {
        return this._updatedAt;
    }

    get value(): LiteralValue | NodeFunctionView | ReferenceValue | undefined {
        return this._value;
    }

    set value(value: NodeParameterValue) {
        if (value.__typename === "NodeFunction") {
            this._value = new NodeFunctionView(value as NodeFunction);
        } else {
            this._value = value as LiteralValue | ReferenceValue;
        }
    }
}