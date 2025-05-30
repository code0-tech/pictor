import {FunctionDefinitionObject} from "./DFlowFunction.view";
import {GenericCombinationStrategy} from "../data-type/DFlowDataType.view";

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
    function_id: "concat",
    runtime_function_id: "concat",
    return_type: "OBJECT",
    parameters: [{
        parameter_id: "first",
        runtime_parameter_id: "first",
        type: "OBJECT",
    }, {
        parameter_id: "second",
        runtime_parameter_id: "second",
        type: "OBJECT",
    }],
    generic_keys: ["1", "2"],
    generic_mapper: [{
        parameter_id: "first",
        types: ["1"],
        generic_target: "O",
    }, {
        parameter_id: "second",
        types: ["2"],
        generic_target: "O",
    }, {
        types: ["1", "2"],
        generic_combination: [GenericCombinationStrategy.AND],
        generic_target: "O",
    }],
}]