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
            function_id: "123456789",
            runtime_function_id: "standard::for",
        },
        parameters: [{
            definition: {
                parameter_id: "123456789_1",
                runtime_parameter_id: "standard::for::array",
            },
            value: [1,2,3,4]
        }, {
            definition: {
                parameter_id: "123456789_2",
                runtime_parameter_id: "standard::map::function",
            },
            value: {
                function: {
                    function_id: "123456789_2",
                    runtime_function_id: "standard::math:add"
                },
                parameters: [{

                }],
                next_node: {
                    function: {
                        function_id: "123456789_2",
                        runtime_function_id: "standard::math:add"
                    },
                    parameters: [{

                    }],
                }
            }
        }]
    }
}