import {ReactiveArrayService} from "../../utils/reactiveArrayService";
import {FunctionDefinitionView} from "./DFlowFunction.view";
import type {FunctionDefinition} from "@code0-tech/sagittarius-graphql-types";


export abstract class DFlowFunctionReactiveService extends ReactiveArrayService<FunctionDefinitionView> {

    getById(id: FunctionDefinition['id']): FunctionDefinitionView | undefined {
        return this.values().find(functionDefinition => functionDefinition.id === id)
    }

}