import {Translation} from "../../../utils/translation";

export interface FunctionDefinition {
    function_id: string
    runtime_function: string //runtime function id
    return_type?: string // data type id
    parameters?: ParameterDefinition[]
    throwing?: string[] // data type id
    deprecatedMessage?: Translation[]
    name?: Translation[]
    description?: Translation[]
    documentation?: Translation[] //as markdown

}

export interface ParameterDefinition {
    parameter_id: string
    runtime_parameter_id: string
    type: string
    name?: Translation[] // overrides the runtime parameter name and ref to language entry
    description?: Translation[]
    default_value?: object
}