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
}, {
    function_id: "std::math::multiply",
    runtime_function_id: "std::math::multiply",
    return_type: "NUMBER",
    parameters: [{
        parameter_id: "std::math::multiply__firstValue",
        runtime_parameter_id: "std::math::multiply__firstValue",
        type: "NUMBER_NODE"
    }, {
        parameter_id: "std::math::multiply__secondValue",
        runtime_parameter_id: "std::math::multiply__secondValue",
        type: "NUMBER_NODE"
    }]
}, {
    function_id: "RETURN",
    runtime_function_id: "RETURN",
    return_type: "NUMBER",
    parameters: [{
        parameter_id: "RETURN__firstValue",
        runtime_parameter_id: "RETURN__firstValue",
        type: "NUMBER"
    }]
}, {
    function_id: "std::object::combine",
    runtime_function_id: "std::object::combine",
    return_type: {
        type: "OBJECT",
        generic_mapper: [{
            types: ["A", "B"],
            generic_combination: [GenericCombinationStrategy.AND],
            generic_target: "O"
        }]
    },
    parameters: [{
        parameter_id: "std::object::combine__first",
        runtime_parameter_id: "std::object::combine__first",
        type: {
            type: "OBJECT",
            generic_mapper: [{
                types: ["A"],
                generic_target: "O"
            }]
        }
    }, {
        parameter_id: "std::object::combine__second",
        runtime_parameter_id: "std::object::combine__second",
        type: {
            type: "OBJECT",
            generic_mapper: [{
                types: ["B"],
                generic_target: "O"
            }]
        }
    }],
    generic_keys: ["A", "B"]
}]