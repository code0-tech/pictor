import {Maybe, Scalars} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceView} from "./DNamespace.view";
import {ReactiveArrayService, ReactiveArrayStore} from "../../utils/reactiveArrayService";

export interface DNamespaceService {
    findById(id:  Maybe<Scalars['NamespaceID']['output']>): DNamespaceView | undefined
}

export class DNamespaceReactiveService extends ReactiveArrayService<DNamespaceView> implements DNamespaceService {

    constructor(payload: ReactiveArrayStore<DNamespaceView>) {
        super(payload);
    }

    findById(id: Maybe<Scalars['NamespaceID']['output']>): DNamespaceView | undefined {
        return this.values().find(namespace => namespace.id === id);
    }

}