import {FlowView} from "./DFlow.view";
import {ReactiveArrayService} from "../../utils/reactiveArrayService";
import type {
    Flow,
    NamespacesProjectsFlowsCreateInput,
    NamespacesProjectsFlowsCreatePayload, NamespacesProjectsFlowsDeleteInput,
    NamespacesProjectsFlowsDeletePayload
} from "@code0-tech/sagittarius-graphql-types";


export abstract class DFlowReactiveService extends ReactiveArrayService<FlowView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId and projectId because the runtimes query needs it

    getById(id: Flow['id']): FlowView | undefined {
        return this.values().find(value => value.id === id);
    }

    /** Creates a new flow. */
    abstract flowCreate(payload: NamespacesProjectsFlowsCreateInput): Promise<NamespacesProjectsFlowsCreatePayload | undefined>
    /** Deletes a namespace project. */
    abstract flowDelete(payload: NamespacesProjectsFlowsDeleteInput): Promise<NamespacesProjectsFlowsDeletePayload | undefined>
}

