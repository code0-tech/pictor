import {ReactiveArrayStore, ReactiveArrayService} from "../../../utils/reactiveArrayService";
import {FunctionDefinition} from "./DFlowFunction.view";

export interface DFlowFunctionService {
    getFunctionDefinition(id: string): FunctionDefinition | undefined
}

export class DFlowFunctionReactiveService extends ReactiveArrayService<FunctionDefinition> implements DFlowFunctionService {

    constructor(store: ReactiveArrayStore<FunctionDefinition>) {
        super(store);
    }

    public getFunctionDefinition(id: string): FunctionDefinition | undefined {
        return this.values().find(functionDefinition => functionDefinition.function_id === id)
    }

}