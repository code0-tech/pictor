import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayStore";
import {DataType} from "./DFlowDataType.view";

export interface DFlowDataTypeService {
    getDataType(id: string): DataType | undefined
}

export class DFlowDataTypeReactiveService extends ReactiveArrayService<DataType> implements DFlowDataTypeService {

    constructor(store: ReactiveArrayStore<DataType>) {
        super(store);
    }

    public getDataType = (id: string): DataType | undefined => {
        return this.values().find(value => value.id === id)
    }

}