import {Translation} from "./translation";

export enum InspectionSeverity {
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