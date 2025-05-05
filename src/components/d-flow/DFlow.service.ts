import {Flow} from "./DFlow.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayStore";

export class DFlowService extends ReactiveArrayService<Flow> {

    constructor(store: ReactiveArrayStore<Flow>) {
        super(store);
    }


}

