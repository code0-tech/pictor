import {ReactiveArrayService} from "../../utils/reactiveArrayService";
import {DRuntimeView} from "./DRuntime.view";
import {
    Namespace,
    Runtime,
    RuntimesCreateInput,
    RuntimesCreatePayload,
    RuntimesDeleteInput,
    RuntimesDeletePayload,
    RuntimesRotateTokenInput,
    RuntimesRotateTokenPayload
} from "@code0-tech/sagittarius-graphql-types";

export type DRuntimeDependencies = {
    namespaceId: Namespace['id']
}

export abstract class DRuntimeReactiveService extends ReactiveArrayService<DRuntimeView, DRuntimeDependencies> {

    getById(id: Runtime['id']): DRuntimeView | undefined {
        return this.values().find(runtime => runtime && runtime.id === id);
    }

    abstract runtimeCreate(payload: RuntimesCreateInput): Promise<RuntimesCreatePayload | undefined>

    abstract runtimeDelete(payload: RuntimesDeleteInput): Promise<RuntimesDeletePayload | undefined>

    abstract runtimeRotateToken(payload: RuntimesRotateTokenInput): Promise<RuntimesRotateTokenPayload | undefined>


}