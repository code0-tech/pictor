import {ReactiveArrayService} from "../../../utils/reactiveArrayService";
import {DFlowSuggestion} from "./DFlowSuggestion.view";

export abstract class DFlowReactiveSuggestionService extends ReactiveArrayService<DFlowSuggestion> {


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
}