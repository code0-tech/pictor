import {FunctionDefinitionObject} from "./DFlowFunction.view";

export const functionData: FunctionDefinitionObject[] = [{
    function_id: "std::math::add",
    runtime_function_id: "std::math::add",
    return_type: "NUMBER",
    parameters: [{
        parameter_id: "std::math::add__firstValue",
        runtime_parameter_id: "std::math::add__firstValue",
        type: "NUMBER"
    }, {
        parameter_id: "std::math::add__secondValue",
        runtime_parameter_id: "std::math::add__secondValue",
        type: "NUMBER"
    }]
}, {
    function_id: "std::array::add",
    runtime_function_id: "std::math::add",
    return_type: "ARRAY",
    parameters: [{
        parameter_id: "std::array::add__array",
        runtime_parameter_id: "std::array::add__array",
        type: "ARRAY"
    }, {
        parameter_id: "std::array::add__value",
        runtime_parameter_id: "std::array::add__value",
        type: "D"
    }],
    generic_keys: ["D"],
    generic_mapper: [{
        parameter_id: "std::array::add__array",
        types: ["D"],
        generic_target: "T"
    }, {
        types: ["D"],
        generic_target: "T"
    }]
}]