import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {DFlowSuggestion} from "./DFlowSuggestion.view";

export class DFlowReactiveSuggestionService extends ReactiveArrayService<DFlowSuggestion> {

    constructor(store: ReactiveArrayStore<DFlowSuggestion>) {
        super(store);
    }

    //get all suggestions with matching hash
    public getSuggestionsByHash(hash: string): DFlowSuggestion[] {
        return this.values().filter(suggestion => suggestion.hash === hash);
    }


    //add suggestion with hash
    public addSuggestion(suggestion: DFlowSuggestion): void {
        this.add(suggestion)
    }

}