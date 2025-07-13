import {ReactiveArrayService, ReactiveArrayStore} from "../../../utils/reactiveArrayService";
import {DFlowSuggestion} from "./DFlowSuggestion.view";

export interface DFlowSuggestionService {
    getSuggestionsByHash(hash: string): DFlowSuggestion[]

    addSuggestion(suggestion: DFlowSuggestion): void
}

export class DFlowReactiveSuggestionService extends ReactiveArrayService<DFlowSuggestion> implements DFlowReactiveSuggestionService {

    constructor(store: ReactiveArrayStore<DFlowSuggestion>) {
        super(store);
    }

    //get all suggestions with matching hash
    public getSuggestionsByHash(hash: string): DFlowSuggestion[] {
        const seen = new Set<string>();
        return this.values()
            .filter(suggestion => suggestion.hash === hash)
            .filter(suggestion => {
                const key = JSON.stringify({
                    path: suggestion.path,
                    value: suggestion.value,
                    type: suggestion.type
                });
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    }


    //add suggestion with hash
    public addSuggestion(suggestion: DFlowSuggestion): void {
        this.add(suggestion)
    }

}