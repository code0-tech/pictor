import {FlowView} from "./DFlow.view";
import {NonReactiveArrayService, NonReactiveArrayStore} from "../../utils/nonReactiveArrayService";
import {describe, test} from "@jest/globals";

export class DFlowNonReactiveService extends NonReactiveArrayService<FlowView> {

    constructor(store: NonReactiveArrayStore<FlowView>) {
        super(store);
    }

}

describe("DFlowNonReactiveService", () => {

    test("should create an instance of DFlowNonReactiveService", () => {

    })

})