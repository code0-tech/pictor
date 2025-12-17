import type {
    LiteralValue,
    NodeFunction,
    ReferenceValue
} from "@code0-tech/sagittarius-graphql-types";

export enum DFlowSuggestionType {
    REF_OBJECT,
    VALUE,
    FUNCTION,
    FUNCTION_COMBINATION,
    DATA_TYPE,
}

export interface DFlowSuggestion {

    displayText: string[]
    path: number[]
    value: LiteralValue | ReferenceValue | NodeFunction
    type: DFlowSuggestionType
}