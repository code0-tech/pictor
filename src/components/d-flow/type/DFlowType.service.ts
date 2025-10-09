import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {FlowTypeView} from "./DFlowType.view";

export interface DFlowTypeService {
    getById(id: string): FlowTypeView | undefined
}

export class DFlowTypeReactiveService extends ReactiveArrayService<FlowTypeView> implements DFlowTypeService {

    constructor(store: ReactiveArrayStore<FlowTypeView>) {
        super(store);
    }

    getById(id: string): FlowTypeView | undefined {
        return this.values().find(value => value.id === id);
    }

}