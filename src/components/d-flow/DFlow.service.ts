import {FlowView} from "./DFlow.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export interface DFlowService {
    getById(id: string): FlowView | undefined;
}

export class DFlowReactiveService extends ReactiveArrayService<FlowView> implements DFlowService {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId and projectId because the runtimes query needs it

    constructor(store: ReactiveArrayStore<FlowView>) {
        super(store);
    }

    getById(id: string): FlowView | undefined {
        return this.values().find(value => value.id === id);
    }
}

