import {DataTypeObject, isValue, Value} from "./data-type/DFlowDataType.view";

export interface FlowObject {
    flow_id: string
    name: string
    type: string //in the actual implementation we will just link the database id
    settings?: FlowSettingObject[]
    input_type?: DataTypeObject
    return_type?: DataTypeObject
    starting_node: NodeFunctionObject
}

export interface FlowSettingObject {
    definition: FlowSettingDefinition
    value: Value
}

export interface FlowSettingDefinition {
    setting_id: string
    key: string
}

export interface NodeFunctionDefinitionObject {
    function_id: string //function::math::add
    runtime_function_id: string //standard::math::add
}

export interface NodeFunctionObject {
    function: NodeFunctionDefinitionObject
    parameters?: NodeParameterObject[]
    next_node?: NodeFunctionObject
}

export interface NodeParameterDefinitionObject {
    parameter_id: string
    runtime_parameter_id: string
}

export interface NodeParameterObject {
    definition: NodeParameterDefinitionObject
    value?: Value
}

export const isNodeFunctionObject = (
    v: NodeFunctionObject
): v is NodeFunctionObject => {
    if (
        !v || typeof v !== 'object' ||
        typeof v.function?.function_id !== 'string' ||
        typeof v.function?.runtime_function_id !== 'string'
    ) return false

    if (v.parameters && (!Array.isArray(v.parameters) || !v.parameters.every(p => isNodeParameterObject(p))))
        return false

    return !(v.next_node && !isNodeFunctionObject(v.next_node));

}

const isNodeParameterObject = (v: NodeParameterObject): boolean =>
    v && typeof v === 'object' &&
    typeof v.definition?.parameter_id === 'string' &&
    typeof v.definition?.runtime_parameter_id === 'string' &&
    (
        v.value === undefined ||
        isValue(v.value)
    )


export class Flow {

    private readonly _id: string
    private readonly _type: string
    private _settings: FlowSettingObject[] | undefined
    private _startingNode: NodeFunction

    constructor(flow: FlowObject) {
        this._id = flow.flow_id
        this._type = flow.type
        this._settings = flow.settings
        this._startingNode = new NodeFunction(flow.starting_node)
    }

    get id(): string {
        return this._id;
    }

    get type(): string {
        return this._type;
    }

    get settings(): FlowSettingObject[] | undefined {
        return this._settings;
    }

    get startingNode(): NodeFunction {
        return this._startingNode;
    }

    set startingNode(value: NodeFunction) {
        this._startingNode = value;
    }
}

export class NodeFunction {

    private readonly _id: string
    private readonly _runtime_id: string
    private _nextNode: NodeFunction | undefined
    private _parameters: NodeFunctionParameter[] | undefined

    constructor(nodeFunction: NodeFunctionObject) {
        this._id = nodeFunction.function.function_id
        this._runtime_id = nodeFunction.function.runtime_function_id
        this._nextNode = nodeFunction.next_node ? new NodeFunction(nodeFunction.next_node) : undefined
        this._parameters = nodeFunction.parameters?.map(parameter => new NodeFunctionParameter(parameter))
    }


    get id(): string {
        return this._id;
    }

    get runtime_id(): string {
        return this._runtime_id;
    }

    get nextNode(): NodeFunction | undefined {
        return this._nextNode;
    }

    set nextNode(value: NodeFunction | undefined) {
        this._nextNode = value;
    }

    public deleteNextNode(): void {
        this.nextNode = this.nextNode?.nextNode
    }

    get parameters(): NodeFunctionParameter[] | undefined {
        return this._parameters;
    }

    set parameters(value: NodeFunctionParameter[] | undefined) {
        this._parameters = value;
    }

    get json(): NodeFunctionObject {
        return {
            function: {
                function_id: this._id,
                runtime_function_id: this._runtime_id
            },
            parameters: this._parameters?.map(param => ({
                definition: {
                    parameter_id: param.id,
                    runtime_parameter_id: param.runtime_id
                },
                value: param.value instanceof NodeFunction ? param.value.json : param.value
            })),
            next_node: this._nextNode ? this._nextNode.json : undefined
        }
    }
}

export class NodeFunctionParameter {

    private readonly _id: string
    private readonly _runtime_id: string
    private _value: Value | NodeFunction | undefined

    constructor(nodeParameter: NodeParameterObject) {
        this._id = nodeParameter.definition.parameter_id
        this._runtime_id = nodeParameter.definition.runtime_parameter_id
        if (isNodeFunctionObject(nodeParameter.value as NodeFunctionObject)) {
            this._value = new NodeFunction(nodeParameter.value as NodeFunctionObject);
        } else {
            this._value = nodeParameter.value
        }

    }

    get id(): string {
        return this._id;
    }

    get runtime_id(): string {
        return this._runtime_id;
    }

    get value(): Value | NodeFunction | undefined {
        return this._value;
    }

    set value(value: Value) {
        if (isNodeFunctionObject(value as NodeFunctionObject)) {
            this._value = new NodeFunction(value as NodeFunctionObject);
        } else {
            this._value = value
        }
    }
}