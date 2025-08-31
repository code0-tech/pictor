import {Translation} from "../../../utils/translation";
import {DataTypeObject, Type} from "../data-type/DFlowDataType.view";

export interface FlowType {
    flow_type_id: string
    name: Translation[]
    description: Translation[]
    documentation?: Translation[] //as markdown
    settings: FlowTypeSetting[]
    input_type?: DataTypeObject // data type
    return_type?: DataTypeObject
}

export interface FlowTypeSetting {
    flow_definition_settings_id: string
    key: string
    name: Translation[]
    unique: boolean
    description: Translation[]
    type: Type // data type id
    default_value?: object
}