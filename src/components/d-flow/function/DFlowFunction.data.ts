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
    runtime_function_id: "std::array::add",
    return_type: {
        type: "ARRAY",
        generic_mapper: [{
            types: ["D"],
            generic_target: "T"
        }]
    },
    parameters: [{
        parameter_id: "std::array::add__array",
        runtime_parameter_id: "std::array::add__array",
        type: {
            type: "ARRAY",
            generic_mapper: [{
                types: ["D"],
                generic_target: "T"
            }]
        }
    }, {
        parameter_id: "std::array::add__value",
        runtime_parameter_id: "std::array::add__value",
        type: "D"
    }],
    generic_keys: ["D"],
}]