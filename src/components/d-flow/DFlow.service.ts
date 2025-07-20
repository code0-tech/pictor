import {Flow} from "./DFlow.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export interface DFlowService {
    getById(id: string): Flow | undefined;
}

export class DFlowReactiveService extends ReactiveArrayService<Flow> implements DFlowService {

    constructor(store: ReactiveArrayStore<Flow>) {
        super(store);
    }

    getById(id: string): Flow | undefined {
        return this.values().find(value => value.id === id);
    }
}

