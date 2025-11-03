import {Maybe, Scalars, TranslationConnection} from "@code0-tech/sagittarius-graphql-types";

export enum InspectionSeverity {
    TYPO,
    GRAMMAR,
    WEAK,
    WARNING,
    ERROR
}

export interface ValidationResult {
    parameterId: Maybe<Scalars["ParameterDefinitionID"]["output"]>
    type: InspectionSeverity
    message: TranslationConnection
}