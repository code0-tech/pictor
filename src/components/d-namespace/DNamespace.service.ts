import {Namespace} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceView} from "./DNamespace.view";
import {ReactiveArrayService} from "../../utils/reactiveArrayService";

export abstract class DNamespaceReactiveService extends ReactiveArrayService<DNamespaceView> {

    //TODO: inject UI error handler for toasts
    //inject: either userId or organizationId because the namespaces query needs it

    getById(id: Namespace['id']): DNamespaceView | undefined {
        return this.values().find(namespace => namespace.id === id);
    }
}