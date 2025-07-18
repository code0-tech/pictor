import {FlowObject} from "./DFlow.view";

export const flow: FlowObject = {
    flow_id: "some_database_id",
    name: "test/test/Flow",
    type: "some_database_id",
    settings: [{
        definition: {
            setting_id: "rest_setting_2",
            key: "URL"
        },
        value: "/test"
    }, {
        definition: {
            setting_id: "rest_setting_1",
            key: "HTTP_METHOD"
        },
        value: "GET"
    }],
    starting_node: {
        function: {
            function_id: "std::math::add",
            runtime_function_id: "std::math::add"
        },
        parameters: [{
            definition: {
                parameter_id: "std::math::add__firstValue",
                runtime_parameter_id: "std::math::add__firstValue"
            },
            value: 5
        }, {
            definition: {
                parameter_id: "standard::math::add__secondValue",
                runtime_parameter_id: "standard::math::add__secondValue"
            },
            value: 10
        }]
    }
}