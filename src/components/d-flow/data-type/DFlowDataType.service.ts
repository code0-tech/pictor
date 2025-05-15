import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayStore";
import {DataType, Type} from "./DFlowDataType.view";

export interface DFlowDataTypeService {
    getDataType(type: Type): DataType | undefined
}

export class DFlowDataTypeReactiveService extends ReactiveArrayService<DataType> implements DFlowDataTypeService {

    constructor(store: ReactiveArrayStore<DataType>) {
        super(store);
    }

    public getDataType = (type: Type): DataType | undefined => {
        return this.values().find(value => value.id === (typeof type === "string" ? type : type.type));
    }

}