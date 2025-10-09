import {Translation} from "../../../utils/translation";
import {FunctionDefinition, Scalars} from "@code0-tech/sagittarius-graphql-types";

export class FunctionDefinitionView {

    private readonly _id: Scalars['FunctionDefinitionID']['output'];
    private readonly _createdAt:  Scalars['Time']['output']
    private readonly _updatedAt:  Scalars['Time']['output']

    constructor(object: FunctionDefinition) {
        this._function_id = object.function_id
        this._runtime_function_id = object.runtime_function_id
        this._return_type = object.return_type
        this._parameters = object.parameters?.map(parameters => new ParameterDefinition(parameters))
        this._throwing = object.throwing
        this._deprecatedMessage = object.deprecatedMessage
        this._name = object.name
        this._description = object.description
        this._documentation = object.documentation
        this._genericKeys = object.generic_keys
        this._genericMapper = object.generic_mapper
    }

    get function_id(): string {
        return this._function_id;
    }

    get runtime_function_id(): string {
        return this._runtime_function_id;
    }

    get return_type(): Type | undefined {
        return this._return_type;
    }

    get parameters(): ParameterDefinition[] | undefined {
        return this._parameters;
    }

    get throwing(): string[] | undefined {
        return this._throwing;
    }

    get deprecatedMessage(): Translation[] | undefined {
        return this._deprecatedMessage;
    }

    get name(): Translation[] | undefined {
        return this._name;
    }

    get description(): Translation[] | undefined {
        return this._description;
    }

    get documentation(): Translation[] | undefined {
        return this._documentation;
    }

    get genericKeys(): string[] | undefined {
        return this._genericKeys;
    }

    get genericMapper(): FunctionGenericMapper[] | undefined {
        return this._genericMapper;
    }
}

export class ParameterDefinition {

    private readonly _parameter_id: string
    private readonly _runtime_function_id: string
    private readonly _type: Type
    private readonly _name?: Translation[]
    private readonly _description?: Translation[]
    private readonly _default_value?: Value

    constructor(object: ParameterDefinitionObject) {
        this._parameter_id = object.parameter_id
        this._runtime_function_id = object.runtime_parameter_id
        this._type = object.type
        this._name = object.name
        this._description = object.description
        this._default_value = object.default_value
    }


    get parameter_id(): string {
        return this._parameter_id;
    }

    get runtime_function_id(): string {
        return this._runtime_function_id;
    }

    get type(): Type {
        return this._type;
    }

    get name(): Translation[] | undefined {
        return this._name;
    }

    get description(): Translation[] | undefined {
        return this._description;
    }

    get default_value(): Value | undefined {
        return this._default_value;
    }
}

