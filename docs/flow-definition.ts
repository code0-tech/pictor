enum EDataType {
    PRIMITIVE, //number, boolean, text
    TYPE,
    OBJECT,
    DATATYPE,
    ARRAY,
    GENERIC,
    FUNCTION
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
    type: EDataType.FUNCTION,
    inputTypes: [{
        name: [{
            code: "en_US",
            text: "item"
        }],
        type: EDataType.GENERIC
    }]
}
