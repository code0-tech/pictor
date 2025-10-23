import {ReactiveArrayStore, ReactiveArrayService} from "../../../utils/reactiveArrayService";
import {FunctionDefinitionView} from "./DFlowFunction.view";
import {Scalars} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowFunctionService {
    getFunctionDefinition(id: string): FunctionDefinitionView | undefined
}

export class DFlowFunctionReactiveService extends ReactiveArrayService<FunctionDefinitionView> implements DFlowFunctionService {

    constructor(store: ReactiveArrayStore<FunctionDefinitionView>) {
        super(store);
    }

    public getFunctionDefinition(id: Scalars['FunctionDefinitionID']['output']): FunctionDefinitionView | undefined {
        return this.values().find(functionDefinition => functionDefinition.id === id)
    }

}