import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DRuntimeView} from "./DRuntime.view";
import {
    Runtime,
    RuntimesCreateInput, RuntimesCreatePayload,
    RuntimesDeleteInput, RuntimesDeletePayload,
    RuntimesRotateTokenInput, RuntimesRotateTokenPayload,
    RuntimesUpdateInput, RuntimesUpdatePayload,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DRuntimeReactiveService extends ReactiveArrayService<DRuntimeView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    getById(id: Runtime['id']): DRuntimeView | undefined {
        return this.values().find(runtime => runtime.id === id);
    }

    abstract runtimeCreate(payload: RuntimesCreateInput): Promise<RuntimesCreatePayload | undefined>

    abstract runtimeDelete(payload: RuntimesDeleteInput): Promise<RuntimesDeletePayload | undefined>

    abstract runtimeRotateToken(payload: RuntimesRotateTokenInput): Promise<RuntimesRotateTokenPayload | undefined>

    abstract runtimeUpdate(payload: RuntimesUpdateInput): Promise<RuntimesUpdatePayload | undefined>

}