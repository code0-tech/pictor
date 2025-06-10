import {Translation} from "./translation";

export const enum InspectionSeverity {
    TYPO,
    GRAMMAR,
    WEAK,
    WARNING,
    ERROR
}

export interface ValidationResult {
    type: InspectionSeverity
    message: Translation[]
}