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
    LOCK_KEY,
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
    throwing?: DataType[]
    deprecated?: boolean
    name: Translation[]
    description: Translation[]
    documentation: Translation[] //as markdown
}


interface RuntimeParameterDefinition {
    runtime_id: string //standard::math::add
    type: DataType
    name: Translation[]
    description: Translation[]
}


interface FunctionDefinition {
    id: string
    runtime_function: RuntimeFunctionDefinition
    return_type?: DataType
    parameters?: ParameterDefinition[]
    name: Translation[]
    description: Translation[]
    documentation: Translation[] //as markdown

}

interface ParameterDefinition {
    id: string
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
    input_type: DataType
    editable: boolean
}

interface FlowDefinitionSetting {
    name: Translation[]
    unique: boolean
    description: Translation[]
    type: DataType
    default_value?: object
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
