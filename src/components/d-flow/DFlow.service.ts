import {Flow} from "./DFlow.view";
import {ReactiveArrayStore, ReactiveArrayService} from "../../utils/reactiveArrayService";

export class DFlowService extends ReactiveArrayService<Flow> {

    constructor(store: ReactiveArrayStore<Flow>) {
        super(store);
    }


}

