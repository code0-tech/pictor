import {Flow} from "./DFlow.view";
import {NonReactiveArrayService, NonReactiveArrayStore} from "../../utils/nonReactiveArrayService";
import {describe, test} from "@jest/globals";

export class DFlowNonReactiveService extends NonReactiveArrayService<Flow> {

    constructor(store: NonReactiveArrayStore<Flow>) {
        super(store);
    }

}

describe("DFlowNonReactiveService", () => {

    test("should create an instance of DFlowNonReactiveService", () => {

    })

})