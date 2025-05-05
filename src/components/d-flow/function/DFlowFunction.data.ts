import {FunctionDefinition} from "./DFlowFunction.view";

const functionData: FunctionDefinition = {
    function_id: "123456789",
    runtime_function: "standard::math::add",
    return_type: "NUMBER",
    parameters: [{
        parameter_id: "123456789_1",
        runtime_parameter_id: "standard::math::add__firstValue",
        type: "NUMBER"
    }, {
        parameter_id: "123456789_2",
        runtime_parameter_id: "standard::math::add__secondValue",
        type: "NUMBER"
    }]
}