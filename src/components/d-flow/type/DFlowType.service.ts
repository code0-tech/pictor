import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {FlowType} from "./DFlowType.view";

export interface DFlowTypeService {
    getById(id: string): FlowType | undefined
}

export class DFlowTypeReactiveService extends ReactiveArrayService<FlowType> implements DFlowTypeService {

    constructor(store: ReactiveArrayStore<FlowType>) {
        super(store);
    }

    getById(id: string): FlowType | undefined {
        return this.values().find(value => value.flow_type_id === id);
    }

}