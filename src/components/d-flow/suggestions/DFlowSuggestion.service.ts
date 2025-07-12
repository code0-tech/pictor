import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {DFlowSuggestion} from "./DFlowSuggestion.view";

export interface DFlowSuggestionService {
    getSuggestionsByHash(hash: string): DFlowSuggestion[]

    addSuggestion(suggestion: DFlowSuggestion): void
}

export class DFlowSuggestionService extends ReactiveArrayService<DFlowSuggestion> implements DFlowSuggestionService {

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