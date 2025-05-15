import {Flow} from "../DFlow.view";

export const enum DFlowInspectionSeverity {
    TYPO,
    GRAMMAR,
    WEAK,
    WARNING,
    ERROR
}

export interface FlowValidation {

}

export const useValidation = (flow: Flow) => {

    //syntactic checking
    // - structure
    // - datatypes matching

    //semantic checking
    // - go throw semantic rules and check if they
    //   are all fine

}