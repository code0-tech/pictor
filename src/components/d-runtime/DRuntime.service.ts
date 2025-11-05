import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";
import {DRuntimeView} from "./DRuntime.view";
import {
    RuntimesCreateInput,
    RuntimesDeleteInput,
    RuntimesRotateTokenInput,
    RuntimesUpdateInput,
    Scalars
} from "@code0-tech/sagittarius-graphql-types";

export abstract class DRuntimeService extends ReactiveArrayService<DRuntimeView> {

    //TODO: inject UI error handler for toasts
    //inject: namespaceId because the runtimes query needs it

    constructor(payload: ReactiveArrayStore<DRuntimeView>) {
        super(payload);
    }

    abstract findById(id: Scalars['RuntimeID']['output']): DRuntimeView | undefined

    abstract runtimeCreate(payload: RuntimesCreateInput): DRuntimeView | undefined

    abstract runtimeDelete(payload: RuntimesDeleteInput): DRuntimeView | undefined

    abstract runtimeRotateToken(payload: RuntimesRotateTokenInput): DRuntimeView | undefined

    abstract runtimeUpdate(payload: RuntimesUpdateInput): DRuntimeView | undefined

}

export abstract class DRuntimeReactiveService extends DRuntimeService {

    findById(id: Scalars["RuntimeID"]["output"]): DRuntimeView | undefined {
        return this.values().find(runtime => runtime.id === id);
    }

    abstract override runtimeCreate(payload: RuntimesCreateInput): DRuntimeView | undefined

    abstract override runtimeDelete(payload: RuntimesDeleteInput): DRuntimeView | undefined

    abstract override runtimeRotateToken(payload: RuntimesRotateTokenInput): DRuntimeView | undefined

    abstract override runtimeUpdate(payload: RuntimesUpdateInput): DRuntimeView | undefined

}