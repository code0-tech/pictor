import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {FlowTypeView} from "./DFlowType.view";
import {FlowType, Scalars} from "@code0-tech/sagittarius-graphql-types";

export abstract class DFlowTypeReactiveService extends ReactiveArrayService<FlowTypeView> {

    getById(id: FlowType['id']): FlowTypeView | undefined {
        return this.values().find(value => value.id === id);
    }

}