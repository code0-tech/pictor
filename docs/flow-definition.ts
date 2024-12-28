enum EDataType {
    PRIMITIVE, //number, boolean, text
    TYPE,
    OBJECT,
    DATATYPE,
    ARRAY,
    GENERIC,
    NODE
}

enum EDataTypeRuleType {
    REGEX,
    NUMBER_RANGE,
    ITEM_OF_COLLECTION,
    CONTAINS_TYPE,
    CONTAINS_KEY,
    //etc
}

interface Translation {
    code: string //de_DE
    text: string
}

interface DataTypeRule {
    type: EDataTypeRuleType
    config: object
}

interface DataType {
    name: Translation[]
    type: EDataType
    rules?: DataTypeRule[]
    inputTypes?: DataType[]
    returnType?: DataType
    parent?: DataType
}


interface RuntimeFunctionDefinition  {
    runtime_id: string //standard::math::add
    parameters?: RuntimeParameterDefinition[]
    return_type?: DataType
}


interface RuntimeParameterDefinition {
    type: DataType
    name: string
}


interface FunctionDefinition {
    runtime_function: RuntimeFunctionDefinition
    return_type?: DataType
    parameters?: ParameterDefinition[]
    name: Translation[]
    description: Translation[]
    documentation: Translation[] //as markdown

}

interface ParameterDefinition {
    type: DataType
    name: Translation[] // overrides the runtime parameter name and ref to language entry
    description: Translation[]
    default_value?: object
}

interface FlowType {
    name: Translation[]
    definition: FlowDefinition
}

interface FlowDefinition {
    settings: FlowDefinitionSetting[]
}

interface FlowDefinitionSetting {
    name: Translation[]
    description: Translation[]
    type: DataType
    default_value?: object
}

interface Flow {
    type: FlowType //in the actual implementation we will just link the name or id
    settings: FlowSetting[]
    starting_node: Node
}

interface FlowSetting {
    definition: FlowDefinitionSetting
    value: object
}

interface Node {
    function: Partial<FunctionDefinition> | string
    parameters?: Parameter[]
    next_node?: Node
}

interface Parameter {
    definition: ParameterDefinition | string
    value?: object
    sub_node?: Node
}



const userObject: DataType = {
    name: [{
        code: "en_US",
        text: "User"
    }],
    type: EDataType.OBJECT,
    rules: [{
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {name: "firstname", type: "text", required: true}
    }, {
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {name: "lastname", type: "text"}
    }, {
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {name: "email", type: "text"}
    }, {
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {name: "age", type: "PositiveNumber"}
    }]

}

const integerArrayType: DataType = {
    name: [{
        code: "en_US",
        text: "IntegerArray"
    }],
    type: EDataType.ARRAY,
    rules: [{
        type: EDataTypeRuleType.CONTAINS_TYPE,
        config: {type: "Number"}
    }]
}


const forLoopFunctionParameterType: DataType = {
    name: [{
        code: "en_US",
        text: "Function"
    }],
    type: EDataType.NODE,
    inputTypes: [{
        name: [{
            code: "en_US",
            text: "item"
        }],
        type: EDataType.GENERIC
    }]
}

const flow: Flow = {

    starting_node: {
        function: "function::user::add", //-> standard::database::add
        parameters: [{
            definition: "function::user::add__user", // -> standard::database::add_object
            value: {
                firstname: "Nico",
                lastname: "Sammito",
                email: "nico@sammito.de",
                age: 20
            }
        }]
    }


}

const flow1: Flow = {

    starting_node: {
        function: "function::user::add", //-> standard::database::add
        parameters: [{
            definition: "function::user::add__user", // -> standard::database::add_object
            sub_node: {
                function: "function::user::get", //-> standard::database::get
                parameters: [{
                    definition: "function::user::get__id", //-> standard::database::get_key
                    value: {id: 123456789}
                }]
            }
        }]
    }

}
