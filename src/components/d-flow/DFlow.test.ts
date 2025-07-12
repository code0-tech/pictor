import {Flow} from "./DFlow.view";
import {NonReactiveArrayService, NonReactiveArrayStore} from "../../utils/nonReactiveArrayService";

export class DFlowNonReactiveService extends NonReactiveArrayService<Flow> {

    constructor(store: NonReactiveArrayStore<Flow>) {
        super(store);
    }

}