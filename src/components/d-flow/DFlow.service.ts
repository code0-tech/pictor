import {Flow} from "./DFlow.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export class DFlowReactiveService extends ReactiveArrayService<Flow> {

    constructor(store: ReactiveArrayStore<Flow>) {
        super(store);
    }

}

