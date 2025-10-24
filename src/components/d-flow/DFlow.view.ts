import {
    DataType,
    Flow,
    FlowSetting,
    FlowType, FunctionDefinition,
    LiteralValue,
    Maybe,
    NodeFunction,
    NodeFunctionConnection,
    NodeParameter,
    NodeParameterConnection,
    NodeParameterValue,
    ReferenceValue,
    RuntimeFunctionDefinition,
    RuntimeParameterDefinition,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export class FlowView {

    /** Time when this Flow was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this Flow */
    private readonly _id?: Maybe<Scalars['FlowID']['output']>;
    /** The input data type of the flow */
    private readonly _inputType?: Maybe<DataType>;
    /** Nodes of the flow */
    private _nodes?: NodeFunctionView[];
    /** The return data type of the flow */
    private readonly _returnType?: Maybe<DataType>;
    /** The settings of the flow */
    private readonly _settings?: FlowSettingView[];
    /** The ID of the starting node of the flow */
    private _startingNodeId?: Maybe<Scalars['NodeFunctionID']['output']>;
    /** The flow type of the flow */
    private readonly _type?: Maybe<FlowType>;
    /** Time when this Flow was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;

    constructor(flow: Flow) {

        this._createdAt = flow.createdAt
        this._id = flow.id
        this._inputType = flow.inputType
        this._nodes = flow.nodes?.nodes?.map(node => new NodeFunctionView(node!!))
        this._returnType = flow.returnType
        this._settings = flow.settings?.nodes?.map(setting => new FlowSettingView(setting!!))
        this._startingNodeId = flow.startingNodeId
        this._type = flow.type
        this._updatedAt = flow.updatedAt

    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["FlowID"]["output"]> | undefined {
        return this._id;
    }

    get inputType(): Maybe<DataType> | undefined {
        return this._inputType;
    }

    get nodes(): NodeFunctionView[] | undefined {
        return this._nodes;
    }

    get returnType(): Maybe<DataType> | undefined {
        return this._returnType;
    }

    get settings(): FlowSettingView[] | undefined {
        return this._settings;
    }

    get startingNodeId(): Maybe<Scalars["NodeFunctionID"]["output"]> | undefined {
        return this._startingNodeId;
    }

    get type(): Maybe<FlowType> | undefined {
        return this._type;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    set startingNodeId(value: Maybe<Scalars["NodeFunctionID"]["output"]>) {
        this._startingNodeId = value;
    }

    addNode(node: NodeFunctionView): void {
        if (!this._nodes) {
            this._nodes = [];
        }
        this._nodes.push(node);
    }

    updateNode(updatedNode: NodeFunctionView): void {
        if (!this._nodes) {
            return;
        }
        this._nodes = this._nodes.map(node => {
            if (node.id === updatedNode.id) {
                return updatedNode;
            }
            return node;
        });
    }

    removeNode(nodeId: Scalars['NodeFunctionID']['output']): void {
        if (!this._nodes) {
            return;
        }
        this._nodes = this._nodes.filter(node => node.id !== nodeId);
    }

    getNodeById(nodeId: Scalars['NodeFunctionID']['output']): NodeFunctionView | undefined {
        if (!this._nodes) {
            return undefined;
        }
        return this._nodes.find(node => node.id === nodeId);
    }

    json(): Flow | undefined {
        return undefined
    }
}

export class NodeFunctionView {


    /** Time when this NodeFunction was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NodeFunction */
    private readonly _id?: Maybe<Scalars['NodeFunctionID']['output']>;
    /** The ID of the next Node Function in the flow */
    private _nextNodeId?: Maybe<Scalars['NodeFunctionID']['output']>;
    /** The parameters of the Node Function */
    private readonly _parameters?: NodeParameterView[];
    /** The definition of the Node Function */
    private readonly _functionDefinition?: Maybe<FunctionDefinition>;
    /** Time when this NodeFunction was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;


    constructor(nodeFunction: NodeFunction) {
        this._createdAt = nodeFunction.createdAt
        this._id = nodeFunction.id
        this._nextNodeId = nodeFunction.nextNodeId
        this._functionDefinition = nodeFunction.functionDefinition
        this._updatedAt = nodeFunction.updatedAt
        this._parameters = nodeFunction.parameters ? nodeFunction.parameters.nodes?.map(param => new NodeParameterView(param!!)) : undefined
    }


    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NodeFunctionID"]["output"]> | undefined {
        return this._id;
    }

    get nextNodeId(): Maybe<Scalars["NodeFunctionID"]["output"]> | undefined {
        return this._nextNodeId;
    }

    get parameters(): NodeParameterView[] | undefined {
        return this._parameters;
    }

    get functionDefinition(): Maybe<FunctionDefinition> | undefined {
        return this._functionDefinition;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    set nextNodeId(value: Maybe<Scalars["NodeFunctionID"]["output"]>) {
        this._nextNodeId = value;
    }

    deleteNextNode() {
        this._nextNodeId = undefined;
    }

    json(): NodeFunction | undefined {
        return undefined
    }
}

export class NodeParameterView {

    /** Time when this NodeParameter was created */
    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** Global ID of this NodeParameter */
    private readonly _id?: Maybe<Scalars['NodeParameterID']['output']>;
    /** The definition of the parameter */
    private readonly _runtimeParameter?: Maybe<RuntimeParameterDefinition>;
    /** Time when this NodeParameter was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The value of the parameter */
    private _value?: LiteralValue | ReferenceValue | NodeFunctionView;

    constructor(nodeParameter: NodeParameter) {
        this._createdAt = nodeParameter.createdAt
        this._id = nodeParameter.id
        this._runtimeParameter = nodeParameter.runtimeParameter
        this._updatedAt = nodeParameter.updatedAt
        if (nodeParameter.value?.__typename === "NodeFunction") {
            this._value = new NodeFunctionView(nodeParameter.value as NodeFunction);
        } else {
            this._value = nodeParameter.value as LiteralValue | ReferenceValue;
        }

    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get id(): Maybe<Scalars["NodeParameterID"]["output"]> | undefined {
        return this._id;
    }

    get runtimeParameter(): Maybe<RuntimeParameterDefinition> | undefined {
        return this._runtimeParameter;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    get value(): LiteralValue | ReferenceValue | NodeFunctionView | undefined {
        return this._value;
    }

    set value(value: NodeParameterValue) {
        if (value.__typename === "NodeFunction") {
            this._value = new NodeFunctionView(value as NodeFunction);
        } else {
            this._value = value as LiteralValue | ReferenceValue;
        }
    }

    json(): NodeParameter | undefined {
        return undefined
    }
}

export class FlowSettingView {

    private readonly _createdAt?: Maybe<Scalars['Time']['output']>;
    /** The identifier of the flow setting */
    private readonly _flowSettingIdentifier?: Maybe<Scalars['String']['output']>;
    /** Global ID of this FlowSetting */
    private readonly _id?: Maybe<Scalars['FlowSettingID']['output']>;
    /** Time when this FlowSetting was last updated */
    private readonly _updatedAt?: Maybe<Scalars['Time']['output']>;
    /** The value of the flow setting */
    private _value?: Maybe<Scalars['JSON']['output']>;

    constructor(flowSetting: FlowSetting) {
        this._createdAt = flowSetting.createdAt
        this._flowSettingIdentifier = flowSetting.flowSettingIdentifier
        this._id = flowSetting.id
        this._value = flowSetting.value
        this._updatedAt = flowSetting.updatedAt
    }

    get createdAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._createdAt;
    }

    get flowSettingId(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._flowSettingIdentifier;
    }

    get id(): Maybe<Scalars["FlowSettingID"]["output"]> | undefined {
        return this._id;
    }

    get value(): Maybe<Scalars["String"]["output"]> | undefined {
        return this._value;
    }

    get updatedAt(): Maybe<Scalars["Time"]["output"]> | undefined {
        return this._updatedAt;
    }

    set value(value: Maybe<Scalars["JSON"]["output"]>) {
        this._value = value;
    }

    json(): FlowSetting | undefined {
        return undefined
    }
}