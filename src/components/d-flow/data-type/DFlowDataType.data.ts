import {DataTypeObject, EDataType, EDataTypeRuleType} from "./DFlowDataType.view";

export const dataTypes: DataTypeObject[] = [{
    data_type_id: "NUMBER",
    type: EDataType.PRIMITIVE,
    rules: [{
        type: EDataTypeRuleType.REGEX,
        config: {pattern: "^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$"}
    }]
}, {
    data_type_id: "HTTP_METHOD",
    type: EDataType.TYPE,
    rules: [{
        type: EDataTypeRuleType.ITEM_OF_COLLECTION,
        config: {items: ["GET", "POST", "PUT", "DELETE", "PATCH"]}
    }]
}, {
    data_type_id: "URL_ENDPOINT",
    type: EDataType.TYPE,
    rules: [{
        type: EDataTypeRuleType.REGEX,
        config: {pattern: "^\/\w+(?:[.:~-]\w+)*(?:\/\w+(?:[.:~-]\w+)*)*$"}
    }]
}, {
    data_type_id: "REQ_OBJECT",
    type: EDataType.OBJECT,
    rules: [{
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {key: "body", type: "OBJECT"}
    }, {
        type: EDataTypeRuleType.LOCK_KEY,
        config: {key: "header", type: "REQ_OBJECT_HEADER"}
    }]
}, {
    data_type_id: "REQ_OBJECT_HEADER",
    type: EDataType.OBJECT,
    rules: [{
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {key: "authorization", type: "TEXT"}
    }, {
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {key: "query", type: "OBJECT"}
    }]
}, {
    data_type_id: "OBJECT",
    type: EDataType.OBJECT
}, {
    data_type_id: "TEXT",
    type: EDataType.PRIMITIVE,
    rules: [{
        type: EDataTypeRuleType.REGEX,
        config: {pattern: "(.*)"}
    }]
}, {
    data_type_id: "ERROR",
    type: EDataType.ERROR,
    parent: "OBJECT",
    rules: [{
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {key: "name ", type: "TRANSLATION"}
    }, {
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {key: "message", type: "TRANSLATION"}
    }, {
        type: EDataTypeRuleType.CONTAINS_KEY,
        config: {key: "suggestion", type: "TRANSLATION"}
    }]
}]