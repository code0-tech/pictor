import {FlowType} from "./DFlowType.view";
import {EDataType, EDataTypeRuleType} from "../data-type/DFlowDataType.view";

export const REST_FLOW_TYPE: FlowType = {
    flow_type_id: "REST",
    name: [{
        text: "REST",
        code: "de_de"
    }],
    description: [{
        text: "REST",
        code: "de_de"
    }],
    settings: [{
        flow_definition_settings_id: "rest_setting_1",
        key: "HTTP_METHOD",
        type: "HTTP_METHOD",
        name: [{
            text: "Http Methode",
            code: "de_de"
        }],
        description: [{
            text: "Wähle eine Http Methode aus",
            code: "de_de"
        }],
        unique: false,
    }, {
        flow_definition_settings_id: "rest_setting_2",
        key: "URL",
        type: "URL_ENDPOINT",
        name: [{
            text: "Endpoint",
            code: "de_de"
        }],
        description: [{
            text: "Gebe einen Endpoint an",
            code: "de_de"
        }],
        unique: true
    }],
    input_type: {
        data_type_id: "REST_FLOW_INPUT_TYPE",
        name: [{
            text: "Anfrage Objekt",
            code: "de_de"
        }],
        type: EDataType.OBJECT,
        rules: [{
            type: EDataTypeRuleType.LOCK_KEY,
            config: {key: "req", type: "REQ_OBJECT"}
        }]
    },
    return_type: {
        data_type_id: "REST_FLOW_RETURN_TYPE",
        name: [{
            text: "Rückgabe Objekt",
            code: "de_de"
        }],
        type: EDataType.OBJECT
    }
}