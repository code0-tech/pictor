import {Namespace} from "@code0-tech/sagittarius-graphql-types";
import {DNamespaceView} from "./DNamespace.view";
import {ReactiveArrayService} from "../../utils";

export abstract class DNamespaceReactiveService extends ReactiveArrayService<DNamespaceView> {

    getById(id: Namespace['id']): DNamespaceView | undefined {
        return this.values().find(namespace => namespace.id === id);
    }

}