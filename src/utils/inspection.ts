import {Maybe, Scalars, Translation} from "@code0-tech/sagittarius-graphql-types";
import {CSSProperties} from "react";

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
    message: Array<Translation>
}

const createWavyUnderline = (color: string, size = "5px 4px"): CSSProperties => ({
    paddingBottom: "0.2rem",
    backgroundRepeat: "repeat-x",
    backgroundPosition: "left bottom",
    backgroundSize: size,
    backgroundImage: `url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'>\
  <path d='M0 3 Q3 0 6 3 T12 3' fill='none' stroke='${color}' stroke-width='2'/>\
</svg>")`,
})

export const underlineBySeverity: Record<InspectionSeverity, CSSProperties> = {
    [InspectionSeverity.TYPO]: {
        borderBottom: "1px dotted #3b82f6", // blue
    },
    [InspectionSeverity.GRAMMAR]: {
        borderBottom: "1px dashed #8b5cf6", // violet
    },
    [InspectionSeverity.WEAK]: {
        borderBottom: "3px double #9ca3af", // gray
    },
    [InspectionSeverity.WARNING]: createWavyUnderline("orange"), // amber
    [InspectionSeverity.ERROR]: createWavyUnderline("red"), // already yours
}