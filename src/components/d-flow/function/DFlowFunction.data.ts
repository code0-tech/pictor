import {FunctionDefinition} from "./DFlowFunction.view";

const functionData: FunctionDefinition[] = [{
    function_id: "",
    runtime_function: "std::array::concat",
    return_type: "ARRAY<K>",
    parameters: [{
        parameter_id: "",
        runtime_parameter_id: "first",
        type: "ARRAY<K>",
    }, {
        parameter_id: "",
        runtime_parameter_id: "second",
        type: "ARRAY<K>",
    }],
    generic_keys: ["K"]
}, {
    function_id: "",
    runtime_function: "std::array::map",
    return_type: "ARRAY",
    parameters: [{
        parameter_id: "",
        runtime_parameter_id: "array",
        type: "ARRAY",
    }, {
        parameter_id: "test",
        runtime_parameter_id: "node",
        type: "MAP_GENERIC_INPUT_NODE",
    }],
    generic_keys: ["K", "T"],
    generic_mapper: [
        {
            generic_source: "T",
            generic_target: "V",
            parameter_id: "test"
        },
        {
            generic_source: "K",
            generic_target: "S",
            parameter_id: "test"
        },
        {
            generic_source: "K",
            generic_target: "T",
        }
    ]
}]