import {Maybe, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceView} from "./DNamespace.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export abstract class DNamespaceService extends ReactiveArrayService<DNamespaceView> {

    //TODO: inject UI error handler for toasts
    //inject: either userId or organizationId because the namespaces query needs it

    constructor(payload: ReactiveArrayStore<DNamespaceView>) {
        super(payload);
    }

    abstract findById(id: Maybe<Scalars['NamespaceID']['output']>): DNamespaceView | undefined
}

export abstract class DNamespaceReactiveService extends DNamespaceService {

    findById(id: Maybe<Scalars['NamespaceID']['output']>): DNamespaceView | undefined {
        return this.values().find(namespace => namespace.id === id);
    }

}