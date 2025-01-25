interface Flow {
    id: string
    type: string //in the actual implementation we will just link the database id
    settings: FlowSetting[]
    starting_node: NodeFunction
}

interface FlowSetting {
    definition: string //in the actual implementation we will just link the database id
    value: object
}

interface NodeFunctionDefintion {
    function_id: string //function::math::add
    runtime_function_id: string //standard::math::add
}

interface NodeFunction {
    function: NodeFunctionDefintion
    parameters?: Parameter[]
    next_node?: NodeFunction
}

interface ParameterDefintion {
    parameter_id: string
    runtime_parameter_id: string
}

interface Parameter {
    definition: ParameterDefintion
    value?: object
    sub_node?: NodeFunction
}

const flow1: Flow = {
    id: "some database id",
    type: "REST",
    settings: [{
        definition: "",
        value: {}
    }],
    starting_node: {
        function: {
            function_id: "function::user::add",
            runtime_function_id: "standard::database::add"
        },
        parameters: [{
            definition: {
                parameter_id: "add__user",
                runtime_parameter_id: "add_object"
            },
            sub_node: {
                function: {
                    function_id: "function::user::get",
                    runtime_function_id: "standard::database::get"
                },
                parameters: [{
                    definition: {
                        parameter_id: "get__id",
                        runtime_parameter_id: "get_key"
                    },
                    value: {id: 123456789}
                }]
            }
        }]
    }

}