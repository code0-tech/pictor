import {ReactiveArrayService} from "../../utils";
import {FlowTypeView} from "./DFlowType.view";
import {FlowType, Namespace, NamespaceProject, Runtime} from "@code0-tech/sagittarius-graphql-types";

export type DFlowTypeDependencies = {
    namespaceId: Namespace['id']
    projectId: NamespaceProject['id']
    runtimeId: Runtime['id']
}

export abstract class DFlowTypeReactiveService extends ReactiveArrayService<FlowTypeView, DFlowTypeDependencies> {

    getById(id: FlowType['id'], dependencies?: DFlowTypeDependencies): FlowTypeView | undefined {
        return this.values(dependencies).find(value => value.id === id);
    }

}