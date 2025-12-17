import {ReactiveArrayService} from "../../utils";
import {FunctionDefinitionView} from "./DFlowFunction.view";
import {FunctionDefinition, Namespace, NamespaceProject, Runtime} from "@code0-tech/sagittarius-graphql-types";

export type DFlowFunctionDependencies = {
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
    runtimeId: Runtime['id']
}

export abstract class DFlowFunctionReactiveService extends ReactiveArrayService<FunctionDefinitionView, DFlowFunctionDependencies> {

    getById(id: FunctionDefinition['id'], dependencies?: DFlowFunctionDependencies): FunctionDefinitionView | undefined {
        return this.values(dependencies).find(functionDefinition => functionDefinition.id === id)
    }

}