import {Translation} from "../../../utils/translation";
import {GenericMapper} from "../data-type/DFlowDataType.view";

export interface FunctionGenericMapper extends GenericMapper {
    parameter_id?: string
}

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
    generic_keys?: string[]
    generic_mapper?: FunctionGenericMapper[]
}

export interface ParameterDefinition {
    parameter_id: string
    runtime_parameter_id: string
    type: string
    name?: Translation[] // overrides the runtime parameter name and ref to language entry
    description?: Translation[]
    default_value?: object
}