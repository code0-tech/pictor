import {ReactiveArrayStore, ReactiveArrayService} from "../../../utils/reactiveArrayService";
import {FunctionDefinitionView} from "./DFlowFunction.view";

export interface DFlowFunctionService {
    getFunctionDefinition(id: string): FunctionDefinitionView | undefined
}

export class DFlowFunctionReactiveService extends ReactiveArrayService<FunctionDefinitionView> implements DFlowFunctionService {

    constructor(store: ReactiveArrayStore<FunctionDefinitionView>) {
        super(store);
    }

    public getFunctionDefinition(id: string): FunctionDefinitionView | undefined {
        return this.values().find(functionDefinition => functionDefinition.function_id === id)
    }

}