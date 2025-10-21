import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {FlowTypeView} from "./DFlowType.view";
import {Scalars} from "@code0-tech/sagittarius-graphql-types";

export interface DFlowTypeService {
    getById(id: string): FlowTypeView | undefined
}

export class DFlowTypeReactiveService extends ReactiveArrayService<FlowTypeView> implements DFlowTypeService {

    constructor(store: ReactiveArrayStore<FlowTypeView>) {
        super(store);
    }

    getById(id: Scalars['TypesFlowTypeID']['output']): FlowTypeView | undefined {
        return this.values().find(value => value.id === id);
    }

}